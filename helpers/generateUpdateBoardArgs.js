const generateUpdateBoardArgs = (boardId, columnId, updatedObject) => {
	const filter = {};
	const update = {};
	const options = {
		new: true,
	};
	if (columnId) {
		// Update a column
		filter._id = boardId;
		filter['columns._id'] = columnId;
		update.$set = {
			'columns.$[column].columnName': updatedObject.columnName,
		};

		options.arrayFilters = [{ 'column._id': columnId }];
	} else if (boardId) {
		// Update a board
		filter._id = boardId;

		update.$set = {
			boardName: updatedObject.boardName,
		};
	}

	return { filter, update, options };
};

module.exports = { generateUpdateBoardArgs };
