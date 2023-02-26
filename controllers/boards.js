const { request, response } = require('express');
const Board = require('../models/Board');
const User = require('../models/User');
const fetchBoards = async (req = request, res = response) => {
	res.json({
		ok: true,
		msg: 'fetchBoards',
	});
};
const createBoard = async (req = request, res = response) => {
	const { boardName, userId, columns } = req.body;
	const boards = await Board.find({ userId });
	//Validation to not repeat board names
	const isBoardNameRepeated = boards.find(b => b.boardName === boardName);
	if (isBoardNameRepeated) {
		return res.json({
			ok: false,
			msg: `User has already created a board with name : ${boardName}`,
		});
	}
	//Data to store
	const data = {
		boardName,
		userId,
		columns: columns || [],
	};
	const board = new Board(data);
	await board.save();
	res.status(201).json({
		ok: true,
		board,
	});
};
module.exports = {
	fetchBoards,
	createBoard,
};
