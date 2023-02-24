const { response, request } = require('express');
const Boards = require('../models/Boards');
const User = require('../models/User');

const fetchBoards = async (req = request, res = response) => {
	const { userid: userId } = req.headers;
	try {
		const userBoardsData = await Boards.find({ userId });
		const { boards } = userBoardsData[0];
		res.json(boards);
	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching boards');
	}
};
const createBoard = async (req, res) => {
	const { userId, name, columns, boardId } = req.body;
	const boardData = {
		name,
		boardId,
		columns,
	};
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				ok: false,
				msg: `No user with ${userId}`,
			});
		}
		const result = await Boards.findOneAndUpdate(
			{ userId },
			{ $push: { boards: boardData } },
			{ upsert: true, new: true }
		);
		res.status(201).json({
			ok: true,
			boardData: result.boards[result.boards.length - 1],
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: 'Error creating board',
		});
	}
};
const createNewTask = async (req, res) => {
	const { title, description, status, taskId, statusId, subtasks, userId, columnId, boardId } = req.body;

	try {
		const newTask = { title, description, status, taskId, statusId, subtasks, userId };

		await Boards.findOneAndUpdate(
			{ userId, 'boards.boardId': boardId, 'boards.columns.columnId': columnId },
			{ $push: { 'boards.$[board].columns.$[column].tasks': newTask } },
			{ arrayFilters: [{ 'board.boardId': boardId }, { 'column.columnId': columnId }], new: true }
		);

		res.status(201).json({
			ok: true,
			task: newTask,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: 'Error creating task',
		});
	}
};

const deleteBoard = async (req = request, res = response) => {
	const { userId, boardId } = req.body;
	try {
		const board = await Boards.findOne({ userId });
		if (!board) {
			return res.status(404).json({
				ok: false,
				msg: 'Board not found',
			});
		}
		const updatedBoards = board.boards.filter(board => board.boardId !== boardId);
		board.boards = updatedBoards;
		await board.save();
		res.json({
			ok: true,
			msg: 'Board deleted successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: 'Error deleting board',
		});
	}
};

module.exports = {
	createBoard,
	createNewTask,
	deleteBoard,
	fetchBoards,
};
