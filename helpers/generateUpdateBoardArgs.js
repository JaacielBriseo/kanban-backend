const generateUpdateBoardArgs = (boardId, columnId, taskId, subtaskId, updatedObject) => {
	const filter = {};
	const update = {};
	const options = {
		new: true,
	};
	if (subtaskId) {
		// Update a subtask
		filter._id = boardId;
		filter['columns._id'] = columnId;
		filter['columns.tasks._id'] = taskId;
		filter['columns.tasks.subtasks._id'] = subtaskId;

		update.$set = {
			'columns.$[column].tasks.$[task].subtasks.$[subtask].title': updatedObject.title,
			'columns.$[column].tasks.$[task].subtasks.$[subtask].isCompleted': updatedObject.isCompleted,
		};

		options.arrayFilters = [{ 'column._id': columnId }, { 'task._id': taskId }, { 'subtask._id': subtaskId }];
	} else if (taskId) {
		// Update a task
		filter._id = boardId;
		filter['columns._id'] = columnId;
		filter['columns.tasks._id'] = taskId;

		update.$set = {
			'columns.$[column].tasks.$[task].title': updatedObject.title,
			'columns.$[column].tasks.$[task].description': updatedObject.description,
			'columns.$[column].tasks.$[task].status': updatedObject.status,
			'columns.$[column].tasks.$[task].subtasks': updatedObject.subtasks,
		};

		options.arrayFilters = [{ 'column._id': columnId }, { 'task._id': taskId }];
	} else if (columnId) {
		// Update a column
		filter._id = boardId;
		filter['columns._id'] = columnId;
		update.$set = {
			'columns.$[column].columnName': updatedObject.columnName,
			'columns.$[column].tasks': updatedObject.tasks,
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
