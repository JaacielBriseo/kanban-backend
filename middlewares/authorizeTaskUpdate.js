const { Task } = require('../models/Task');

const authorizeTaskUpdate = (req, res, next) => {
	const { taskId } = req.params;
	const userId = req.user._id;
	console.log(taskId);
	Task.findById(taskId).exec((err, task) => {
		if (err) {
			return next(err);
		}
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		const validUsers = [task.assignedTo.toString(), task.manager.toString()];

		if (!validUsers.includes(userId)) {
			return res.status(403).json({ message: 'Not authorized to update task.' });
		}
		next();
	});
};
module.exports = authorizeTaskUpdate;
