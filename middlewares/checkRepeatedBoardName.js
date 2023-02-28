const Board = require('../models/Board');
const checkRepeatedBoardName = async (req, res, next) => {
	const { boardName } = req.body;
	const userId = req.user._id;
	const existingBoard = await Board.findOne({ userId, boardName });
	if (existingBoard) {
		return res.status(400).json({
			ok: false,
			msg: `A board with the name "${boardName}" already exists for this user.`,
		});
	}
	next();
};
module.exports = checkRepeatedBoardName;
