const jwt = require('jsonwebtoken');

const User = require('../models/user');

const auth = async (req, res, next) => {
	// console.log("auth middleware");
	// next();

	// console.log(req, res);

	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		// console.log(token);
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});

		if (!user) {
			throw new Error();
		}
		req.token = token;
		req.user = user;
		next();
	} catch (e) {
		res.status(401).send({ error: 'Please authentication' });
	}
};

module.exports = auth;
