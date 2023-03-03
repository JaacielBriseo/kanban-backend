const { Task } = require('../models/Task');
const { request, response } = require('express');

const createTask = async (req = request, res = response) => {
	const { column, title, description, status } = req.body;
	const task = new Task({ column, title, description, status });
	await task.save();
	res.json({
		ok: true,
		task,
	});
};
const updateTask = async (req = request, res = response) => {
	const { taskId } = req.params;
	const updatedData = req.body;
	try {
		const task = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });

		res.json({
			ok: true,
			task,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error : ${error}`,
		});
	}
};
const deleteTask = async (req = request, res = response) => {
	const { taskId } = req.params;
	try {
		const task = await Task.findByIdAndDelete(taskId);

		res.json({
			ok: true,
			deletedTask: task,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error : ${error}`,
		});
	}
};

module.exports = {
	createTask,
	updateTask,
	deleteTask,
};
