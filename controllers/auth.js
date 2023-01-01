const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const registerUser = async (req, res = response) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				ok: false,
				msg: 'An user already has this email',
			});
		}
		user = new User(req.body);

		//Encript password
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		//JWT
		const token = await generateJWT(user.id, user.name);

		res.status(201).json({
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

const loginUser = async (req, res = response) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: 'No user with email provided',
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

const revalidateToken = async (req, res = response) => {
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
	registerUser,
	loginUser,
	revalidateToken,
};
