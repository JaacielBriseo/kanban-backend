const generateUpdateTaskArgs = (taskId, updatedTaskData) => {
	const filter = {};
	const update = {};
	const options = {
		new: true,
	};
	// Update a task
	filter._id = taskId;

	update.$set = {
		title: updatedTaskData.title,
		subtasks: updatedTaskData.subtasks,
		description: updatedTaskData.description,
		status: updatedTaskData.status,
		parentColumnId: updatedTaskData.parentColumnId,
	};

	return { filter, update, options };
};

module.exports = { generateUpdateTaskArgs };
