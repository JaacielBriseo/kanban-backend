const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req = request, res = response) => {
	const { limit = 5, from = 0 } = req.query;
	const query = { isActive: true };

	const [total, usuarios] = await Promise.all([
		User.countDocuments(query),
		User.find(query).skip(Number(from)).limit(Number(limit)),
	]);

	res.json({
		total,
		usuarios,
	});
};
const registerUser = async (req = request, res = response) => {
	const { password } = req.body;
	try {
		const user = new User(req.body);

		//Encript password
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		//JWT
		const token = await generateJWT(user.id, user.name);

		res.status(201).json({
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

const loginUser = async (req = request, res = response) => {
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
const updateUser = async (req = request, res = response) => {
	const { id } = req.params;
	const { _id, password, google, email, ...rest } = req.body;
	if (password) {
		const salt = bcrypt.genSaltSync();
		rest.password = bcrypt.hashSync(password, salt);
	}
	const usuario = await User.findByIdAndUpdate(id, rest);
	res.status(200).json({
		ok: true,
		usuario,
	});
};

const deleteUser = async (req = request, res = response) => {
	const { id } = req.params;
	//This doesn't remove entirely from the db, it just change its active state to false
	const usuario = await User.findByIdAndUpdate(id, { isActive: false });
	res.json(usuario);
};

module.exports = {
	registerUser,
	updateUser,
	deleteUser,
	getUsers,
};
