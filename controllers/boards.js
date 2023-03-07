const { request, response } = require('express');
const { Board } = require('../models/Board');
const { Task } = require('../models/Task');
const { generateUpdateBoardArgs } = require('../helpers');
const User = require('../models/User');
//! Get boards by user
const getUserBoards = async (req = request, res = response) => {
	const userId = req.user._id;
	try {
		const boards = await Board.find({ manager: userId })
		.populate('manager', 'name email')

		//? Retrieve all tasks for the user
		const tasks = await Task.find({
			parentColumnId: { $in: boards.map(board => board.columns.map(column => column._id)).flat() },})
			.populate('assignedTo', 'name email')
			.populate('manager', 'name email');

		//? Populate tasks for each column in each board
		boards.forEach(board => {
			board.columns.forEach(column => {
				const tasksForColumn = tasks.filter(task => task.parentColumnId.equals(column._id));
				column.tasks = tasksForColumn;
			});
		});
		res.json({
			ok: true,
			boards,
			tasks,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
		});
	}
};

//! Create new board
const createNewBoard = async (req = request, res = response) => {
	const userId = req.user._id;
	const data = req.body;
	try {
		const board = new Board({ manager: userId, ...data });
		await board.save();
		res.status(201).json({
			ok: true,
			board,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
		});
	}
};

//! Delete Board
const deleteBoard = async (req = request, res = response) => {
	const { boardId } = req.params;
	try {
		await Board.findByIdAndDelete(boardId);
		res.status(201).json({
			ok: true,
			msg: `Board deleted.`,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
		});
	}
};

//! Update board
const updateBoard = async (req = request, res = response) => {
	const { boardId } = req.params;
	const { updatedBoardData } = req.body;
	const { filter, options, update } = generateUpdateBoardArgs(boardId, updatedBoardData);
	try {
		const updatedBoard = await Board.findOneAndUpdate(filter, update, options);

		res.status(201).json({
			ok: true,
			updatedBoard,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
		});
	}
};

const addMemberToBoard = async (req = request, res = response) => {
	const userId = req.user._id;
	const { boardId } = req.params;
	const { email } = req.body; //Email of the user to add
	try {
		const { _id: newMemberId, name } = await User.findOne({ email });
		const filter = { _id: boardId, manager: userId };
		const update = { $push: { members: newMemberId } };
		const board = await Board.findOneAndUpdate(filter, update, { new: true });
		res.json({
			ok: true,
			// board,
			board,
			msg: `User : ${name} added correctly.`,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
		});
	}
};

module.exports = {
	//* Board CRUD's
	createNewBoard,
	getUserBoards,
	deleteBoard,
	updateBoard,

	//* Users management operations
	addMemberToBoard,
};
