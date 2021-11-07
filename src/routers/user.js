const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const sharp = require('sharp');
// const Task = require('../models/task');
const multer = require('multer');
const router = new express.Router();

const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');

router.post('/users', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post('/users/login', async (req, res) => {
	console.log(req.body);
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send();
	}
});

router.get('/users', auth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (error) {
		res.status(500).send(error);
	}
});

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

// router.get('/users/:id', async (req, res) => {
// 	const _id = req.params.id;

// 	try {
// 		const user = await User.findById(_id);
// 		if (!user) {
// 			return res.status(404).send();
// 		}
// 		res.send(user);
// 	} catch (e) {
// 		res.status(500).send();
// 	}
// });

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
		// const user = await User.findById(req.user._id);

		updates.forEach((update) => (req.user[update] = req.body[update]));
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// });

		// await req.user.save();
		// if (!req.user) {
		// 	return res.status(404).send();
		// }
		await req.user.save();
		res.send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		// const user = await User.findByIdAndDelete(req.user._id);
		// console.log(user);
		// if (!user) {
		// 	return res.status(404).send();
		// }

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
