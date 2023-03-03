const handleChangeTaskColumn = (task, updatedBoard) => {
	const newColumnForTask = updatedBoard.columns.find(column => column.columnName === task.status);
	const originalColumnForTask = updatedBoard.columns.find(column => column.tasks.includes(task));
	if (originalColumnForTask && originalColumnForTask !== newColumnForTask) {
		originalColumnForTask.tasks.splice(originalColumnForTask.tasks.indexOf(task), 1);
	}
	newColumnForTask.tasks.push({
		title: task.title,
		description: task.description,
		status: task.status,
		subtasks: task.subtasks,
		_id: task._id,
	});
};
module.exports = handleChangeTaskColumn;
