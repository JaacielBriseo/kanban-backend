const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validateJWT = async (req = request, res = response, next) => {
	//x-token headers
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			ok: false,
			msg: 'No token on request',
		});
	}
	try {
		const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

		//User that matches the payload.uid
		const user = await User.findById(payload.uid);
		if (!user) {
			return res.status(401).json({
				ok: false,
				msg: 'User doesn`t exist on db.',
			});
		}

		//Verify if uid is active
		if (!user.isActive) {
			return res.status(401).json({
				ok: false,
				msg: 'Inactive user.',
			});
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			ok: false,
			msg: 'Unvalid token.',
		});
	}
};

module.exports = {
	validateJWT,
};
