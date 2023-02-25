const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/generateJWT');

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

const updateUser = async (req = request, res = response) => {
	const { id } = req.params;
	const { _id, password, google, email, ...rest } = req.body;
	if (password) {
		const salt = bcrypt.genSaltSync();
		rest.password = bcrypt.hashSync(password, salt);
	}
	const user = await User.findByIdAndUpdate(id, rest);
	res.status(200).json({
		ok: true,
		user,
	});
};

const deleteUser = async (req = request, res = response) => {
	const { id } = req.params;
	const user = await User.findByIdAndUpdate(id, { isActive: false });
	res.json(user);
};

module.exports = {
	registerUser,
	updateUser,
	deleteUser,
	getUsers,
};
