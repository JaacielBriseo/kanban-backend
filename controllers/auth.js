const { request, response } = require('express');
const { generateJWT } = require('../helpers/generateJWT');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { googleVerify } = require('../helpers/googleVerify');

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
			user,
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
	const user = req.user;
	//Generate new token and return in this petition

	const token = await generateJWT(user._id, user.name);

	res.json({
		ok: true,
		token,
		user,
	});
};

const googleSignIn = async (req = request, res = response) => {
	const { id_token } = req.body;
	try {
		const { name, email, img } = await googleVerify(id_token);

		let user = await User.findOne({ email });
		//Handling if user doesnt exist on db
		if (!user) {
			const userData = { name, email, password: ':p', img, google: true, role: 'USER_ROLE' };
			user = new User(userData);
			await user.save();
		}
		//If user is on db but inactive
		if (!user.isActive) {
			return res.status(401).json({
				ok: false,
				msg: 'Talk to the admin, user blocked.',
			});
		}
		//Generate JWT
		const token = await generateJWT(user.uid);

		res.json({
			ok: true,
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			ok: false,
			msg: `Cannot verify token`,
		});
	}
};
module.exports = {
	loginUser,
	revalidateToken,
	googleSignIn,
};
