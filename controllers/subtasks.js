const { Subtask } = require('../models/Subtask');
const { request, response } = require('express');

const createSubtask = async (req = request, res = response) => {
	const { task, isCompleted, title } = req.body;
	const subtask = new Subtask({ task, isCompleted, title });
	await subtask.save();
	res.json({
		ok: true,
		subtask,
	});
};

const updateSubtask = async (req = request, res = response) => {
	const { subtaskId } = req.params;
	const updatedData = req.body;
	try {
		const subtask = await Subtask.findByIdAndUpdate(subtaskId, updatedData, { new: true });

		res.json({
			ok: true,
			subtask,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error : ${error}`,
		});
	}
};
const deleteSubtask = async (req = request, res = response) => {
	const { subtaskId } = req.params;
	try {
		const subtask = await Subtask.findByIdAndDelete(subtaskId);

		res.json({
			ok: true,
			deletedSubtask: subtask,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error : ${error}`,
		});
	}
};

module.exports = {
	createSubtask,
	updateSubtask,
	deleteSubtask,
};
