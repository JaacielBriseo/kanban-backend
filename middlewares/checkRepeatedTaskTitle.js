const { Task } = require('../models/Task');
const checkRepeatedTaskTitle = async (req, res, next) => {
	const { title, parentColumnId } = req.body;
	const existingTask = await Task.findOne({ parentColumnId, title });
	if (existingTask) {
		return res.status(400).json({
			ok: false,
			msg: `A Task with the title "${title}" already exists in this column.`,
		});
	}
	next();
};
module.exports = checkRepeatedTaskTitle;
