const { request, response } = require('express');
const { generateJWT } = require('../helpers/generateJWT');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const loginUser = async (req = request, res = response) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		//If not user match with email, return
		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: 'No user found.',
			});
		}
		//If user is not active, return
		if (!user.isActive) {
			return res.status(400).json({
				ok: false,
				msg: 'Not an active user.',
			});
		}
		//Confirm passwords
		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Incorrect password',
			});
		}

		//JWT
		const token = await generateJWT(user.id, user.name);

		res.json({
			ok: true,
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Please contact the admin',
		});
	}
};

const revalidateToken = async (req = request, res = response) => {
	const uid = req.uid;
	const name = req.name;

	//Generate new token and return in this petition

	const token = await generateJWT(uid, name);

	res.json({
		ok: true,
		token,
	});
};

module.exports = {
	loginUser,
	revalidateToken,
};
