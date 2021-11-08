const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()



// @route GET /users/loginUser
// @desc Check if user if login user
// @access Public

router.get('/', auth, async (req, res) => {
	console.log(req.headers)
	try {
		if(!req.user){
			return res.status(400).send({success: false, message: 'User not found'})
		}
		res.json({user: req.user,success: true })
	} catch (error) {
		console.log(error);
		res.status(500).json({success: false, message:  'Internal server error'})
	}
})



// Register
router.post('/users/register', async (req, res) => {
	
	const user = new User(req.body);
	
	try {
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token, success: true });

		console.log('create user', user, token, )
	} catch (e) {
		res.status(400).send(e);
	}
});


// Login 
router.post('/users/login', async (req, res) => {
	console.log(req.body);
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		// console.log('hihih', user);
		const token = await user.generateAuthToken();
		res.send({ user, token, success: true });
	} catch (e) {
		res.status(400).send({success: false, message: 'Wrong username or password'});
	}
});

// Get all users
router.get('/users', auth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (error) {
		res.status(500).send(error);
	}
});


// Logout
router.post('/users/logout', auth, async (req, res) => {
	try {
		console.log(req.user.tokens);
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});

		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/me', auth, async (req, res) => {
	console.log(req.user);
	res.send(req.user);
});


router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];

	const isValidOperation = updates.every((update) => {
		return allowedUpdates.includes(update);
	});

	if (!isValidOperation) {
		return res.status(400).send({
			error: 'Invalid Updates',
		});
	}

	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		sendCancelEmail(req.user.email, req.user.name);
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});
const upload = multer({
	//   dest: 'avatar',
	limits: { fileSize: 1000000 },
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpeg|png|jpg)$/)) {
			return cb(new Error('Please upload jpeg, jpg or png file'));
		}

		cb(undefined, true);
	},
});

router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

		// req.user.avatar = req.file.buffer;
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error();
		}

		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send(e);
	}
});

module.exports = router;
