const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req = request, res = response, next) => {
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
		console.log(payload);
		req.uid = payload.uid;
		req.name = payload.name;
	} catch (error) {
		return res.status(401).json({
			ok: false,
			msg: 'Unvalid token',
		});
	}

	next();
};

module.exports = {
	validateJWT,
};
