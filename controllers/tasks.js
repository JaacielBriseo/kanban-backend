const { generateUpdateTaskArgs } = require('../helpers/generateUpdateTaskArgs');
const { Task } = require('../models/Task');
const { request, response } = require('express');

const createTask = async (req = request, res = response) => {
	const { column, title, description, status, subtasks, parentColumnId } = req.body;
	const task = new Task({ column, title, description, status, subtasks, parentColumnId });
	await task.save();
	res.json({
		ok: true,
		task,
	});
};
const updateTask = async (req = request, res = response) => {
	const { taskId } = req.params;
	const { updatedTaskData } = req.body;
	const { filter, options, update } = generateUpdateTaskArgs(taskId, updatedTaskData);
	try {
		const updatedTask = await Task.findOneAndUpdate(filter, update, options);

		res.status(201).json({
			ok: true,
			updatedTask,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error happened: ${error}`,
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
