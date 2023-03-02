const { request, response } = require('express');
const Board = require('../models/Board');
const { generateUpdateBoardArgs } = require('../helpers');

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
		if (
			updatedObject.status &&
			updatedObject.status !==
				updatedBoard.columns.find(column => column.tasks.find(task => task._id.toString() === taskId)).columnName
		) {
			const tasksArray = updatedBoard.columns.map(column => column.tasks);
			const flattedTaskArray = tasksArray.flatMap(task => task);
			const updatedTask = flattedTaskArray.find(task => task._id.toString() === taskId);
			const newColumnForTask = updatedBoard.columns.find(column => column.columnName === updatedObject.status);
			const originalColumnForTask = updatedBoard.columns.find(column => column.tasks.includes(updatedTask));
			if (originalColumnForTask && originalColumnForTask !== newColumnForTask) {
				originalColumnForTask.tasks.splice(originalColumnForTask.tasks.indexOf(updatedTask), 1);
			}
			newColumnForTask.tasks.push({
				title: updatedTask.title,
				description: updatedTask.description,
				status: updatedTask.status,
				subtasks: updatedTask.subtasks,
				_id: updatedTask._id,
			});
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
	deleteBoard,
	updateBoard,
};
