const { request, response } = require('express');
const { Board } = require('../models/Board');
const { generateUpdateBoardArgs } = require('../helpers');
const handleChangeTaskColumn = require('../helpers/handleChangeTaskColumn');
const { generateDeleteArgs } = require('../helpers/generateDeleteArgs');

//! Get boards by user
const getUserBoards = async (req = request, res = response) => {
	const userId = req.user._id;
	try {
		const userBoards = await Board.find({ userId }).populate({
			path: 'columns',
			populate: {
				path: 'tasks',
				populate: {
					path: 'subtasks',
					model: 'Subtask',
				},
			},
		});

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
	const { boardName } = req.body;
	const userId = req.user._id;
	try {
		const board = new Board({ userId, boardName });
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

//! Delete Field from the board or entire board depending on params the frontend send.
const deleteField = async (req = request, res = response) => {
	const { boardId, columnId, taskId } = req.params;
	const { filter, options, update } = generateDeleteArgs(boardId, columnId, taskId);
	try {
		await Board.findOneAndUpdate(filter, update, options);
		res.status(201).json({
			ok: true,
			msg: `Task deleted.`,
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
	const { filter, options, update } = generateUpdateBoardArgs(boardId, columnId, taskId, subtaskId, updatedObject);
	try {
		const updatedBoard = await Board.findOneAndUpdate(filter, update, options);
		if (
			updatedObject.status &&
			updatedObject.status !==
				updatedBoard.columns.find(column => column.tasks.find(task => task._id.toString() === taskId)).columnName
		) {
			const tasksArray = updatedBoard.columns.map(column => column.tasks);
			const flattedTaskArray = tasksArray.flatMap(task => task);
			const updatedTask = flattedTaskArray.find(task => task._id.toString() === taskId);
			handleChangeTaskColumn(updatedTask, updatedBoard);
		}
		await updatedBoard.save();

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

module.exports = {
	createNewBoard,
	getUserBoards,
	deleteField,
	updateBoard,
};
