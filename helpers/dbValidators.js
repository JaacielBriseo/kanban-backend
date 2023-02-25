const Role = require('../models/Role');
const User = require('../models/User');

const isValidRole = async (role = '') => {
	const isRoleRegistered = await Role.findOne({ role });
	if (!isRoleRegistered) {
		throw new Error(`Role: ${role} is not registered on the db.`);
	}
};
const checkEmailExists = async (email = '') => {
	const isEmailRegistered = await User.findOne({ email });
	if (isEmailRegistered) {
		throw new Error(`Email: ${email} is already registered on the db.`);
	}
};
const checkUserById = async id => {
	const isUserRegistered = await User.findById(id);
	if (!isUserRegistered) {
		throw new Error(`Id doesnt exist in the db ${id}.`);
	}
};

module.exports = {
	isValidRole,
	checkEmailExists,
	checkUserById,
};
