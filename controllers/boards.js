const { request, response } = require('express');
const Board = require('../models/Board');

//! Get boards by user
const getUserBoards = async (req = request, res = response) => {
	const { userId } = req.params;
	try {
		const userBoards = await Board.find({ userId });
		res.json({
			ok: true,
			userBoards,
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
	const { userId, columns, boardName } = req.body;
	try {
		const board = new Board({ userId, columns, boardName });
		await board.save();
		res.status(201).json({
			ok: true,
			boardName,
			columns,
			boardId: board._id,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
		});
	}
};

//! Delete board
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
	const { id } = req.params;
	const { userId, ...rest } = req.body;
	try {
		const newBoard = await Board.findByIdAndUpdate(id, rest, { new: true });
		res.status(201).json(newBoard);
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
		});
	}
};

//! Update task
const updateTask = async (req = request, res = response) => {
	const { id } = req.params;
	const { taskId, columnId, ...rest } = req.body;
	try {
		const updatedTask = await Board.findOneAndUpdate(
			{ _id: id, 'columns._id': columnId, 'columns.tasks._id': taskId },
			{ $set: { 'columns.$.tasks': rest } },
			{ new: true }
		);
		res.status(201).json({
			ok: true,
			updatedTask,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
		});
	}
};
module.exports = {
	createNewBoard,
	getUserBoards,
	deleteBoard,
	updateBoard,
	updateTask,
};
