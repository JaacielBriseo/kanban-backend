const { generateUpdateTaskArgs } = require('../helpers/generateUpdateTaskArgs');
const { Task } = require('../models/Task');
const { request, response } = require('express');
const User = require('../models/User');

const createTask = async (req = request, res = response) => {
	const { title, description, status, subtasks, parentColumnId } = req.body;
	const userId = req.user._id;
	const task = new Task({ manager: userId, title, description, status, subtasks, parentColumnId });
	try {
		await task.save();
		res.json({
			ok: true,
			task,
		});
	} catch (error) {
		console.log(error);
		res.json({
			ok: false,
			msg: `Error creating task, try again later.`,
		});
	}
};
const updateTask = async (req = request, res = response) => {
	const { taskId } = req.params;
	const {updatedTaskData} = req.body;
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
const assignUserToTask = async (req, res) => {
	const userId = req.user._id;
	const { taskId } = req.params;
	const { email } = req.body.userToAssign;
	try {
		const userToAssign = await User.findOne({ email });
		const filter = { _id: taskId, manager: userId };
		const update = { $set: { assignedTo: userToAssign } };
		const task = await Task.findOneAndUpdate(filter, update, { new: true });
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

module.exports = {
	createTask,
	updateTask,
	deleteTask,

	assignUserToTask,
};
