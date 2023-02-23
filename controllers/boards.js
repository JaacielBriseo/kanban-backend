const { response, request } = require('express');
const Board = require('../models/Board');

const createBoard = async (req, res) => {
	const { userId, name, columns, boardId } = req.body;
	try {
		const boardData = {
			userId,
			name,
			boardId,
			columns,
		};
		const newBoard = await Board.create(boardData);
		res.status(201).json({
			ok: true,
			newBoard,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			ok: false,
			msg: 'Error creating board',
		});
	}
};
const fetchBoards = async (req = request, res = response) => {
  const { userid: userId } = req.headers;
  try {
    const boards = await Board.find({ userId });
		console.log(boards);
    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching boards');
  }
};

module.exports = {
	createBoard,
	fetchBoards,
};
