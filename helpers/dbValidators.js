const Board = require('../models/Board');
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
const checkBoardExists = async boardId => {
	const isBoardOnDB = await Board.findById(boardId);
	if (!isBoardOnDB) {
		throw new Error(`Board with ID: ${boardId} doesn't exist on db.`);
	}
};

module.exports = {
	isValidRole,
	checkEmailExists,
	checkUserById,
	checkBoardExists,
};
