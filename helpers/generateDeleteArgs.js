const generateDeleteArgs = (boardId, columnId, taskId, subtaskId) => {
	const filter = {};
	const update = {};
	const options = {
		new: true,
	};

	if (subtaskId) {
		// Delete a subtask
		filter._id = boardId;
		filter['columns._id'] = columnId;
		filter['columns.tasks._id'] = taskId;
		filter['columns.tasks.subtasks._id'] = subtaskId;

		update.$pull = {
			'columns.$[column].tasks.$[task].subtasks': { _id: subtaskId },
		};

		options.arrayFilters = [{ 'column._id': columnId }, { 'task._id': taskId }, { 'subtask._id': subtaskId }];
	} else if (taskId) {
		// Delete a task
		filter._id = boardId;
		filter['columns._id'] = columnId;
		filter['columns.tasks._id'] = taskId;

		update.$pull = {
			'columns.$[column].tasks': { _id: taskId },
		};

		options.arrayFilters = [{ 'column._id': columnId }, { 'task._id': taskId }];
	} else if (columnId) {
		// Delete a column
		filter._id = boardId;
		filter['columns._id'] = columnId;

		update.$pull = {
			columns: { _id: columnId },
		};

		options.arrayFilters = [{ 'column._id': columnId }];
	} else if (boardId) {
		// Delete a board
		filter._id = boardId;

		update.$pull = {};
	}

	return { filter, update, options };
};

module.exports = { generateDeleteArgs };
