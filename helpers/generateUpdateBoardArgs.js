const generateUpdateBoardArgs = (boardId, updatedBoardData) => {
	const filter = {};
	const update = {};
	const options = {
		new: true,
	};
	// Update a board
	filter._id = boardId;

	update.$set = {
		boardName: updatedBoardData.boardName,
		columns: updatedBoardData.columns,
	};

	return { filter, update, options };
};

module.exports = { generateUpdateBoardArgs };
