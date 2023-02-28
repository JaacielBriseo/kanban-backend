const { request, response } = require('express');
const Board = require('../models/Board');
const { generateUpdateBoardArgs } = require('../helpers/generateUpdateBoardArgs');

//! Get boards by user
const getUserBoards = async (req = request, res = response) => {
	const userId = req.user._id;
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
	const { columns, boardName } = req.body;
	const userId = req.user._id;
	try {
		const board = new Board({ userId, columns, boardName });
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
	const { boardId } = req.params;
	const { columnId, taskId, subtaskId } = req.query;
	const { updatedObject } = req.body;
	const argsToUpdate = generateUpdateBoardArgs(boardId, columnId, taskId, subtaskId, updatedObject);
	try {
		const updatedBoard = await Board.findOneAndUpdate(argsToUpdate.filter, argsToUpdate.update, argsToUpdate.options);
		res.status(201).json({
			ok: true,
			msg: `Update Successful.`,
			updatedBoard,
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
};
