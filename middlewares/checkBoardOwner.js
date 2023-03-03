const {Board} = require('../models/Board');
const checkBoardOwner = async (req, res, next) => {
	const { boardId } = req.params;
	const userId = req.user._id;
	const board = await Board.findById(boardId);
	if (!board) {
		return res.json({
			ok: false,
			msg: `No board found... Check the request params.`,
		});
	}
	if (board.userId.toString() !== userId.toString()) {
		return res.json({
			ok: false,
			msg: `This user is not the owner of the board.`,
		});
	}
	next();
};

module.exports = checkBoardOwner;
