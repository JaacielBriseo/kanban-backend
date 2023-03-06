const { Schema, model } = require('mongoose');
const TaskSchema = Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	subtasks: [
		{
			subtaskTitle: { type: String, required: [true, 'Subtask title is required.'] },
			isCompleted: { type: Boolean, default: false },
		},
	],
	parentColumnId: { type: Schema.Types.ObjectId, required: [true, 'A parent column ID is required.'] },
	comments: [
		{
			author: { type: Schema.Types.ObjectId, required: [true, 'Id of the author is required.'], ref: 'User' },
			text: { type: String, required: [true, 'A text to post a comment is required.'] },
		},
	],
	assignedTo: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		default: null,
	},
	manager: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'The manager ID must be specified.'],
	},
});
TaskSchema.methods.toJSON = function () {
	const { __v, _id, ...task } = this.toObject();
	task.taskId = _id;
	task.subtasks = task.subtasks.map(subtask => {
		const { _id, ...rest } = subtask;
		rest.subtaskId = _id;
		return rest;
	});
	return task;
};
const Task = model('Task', TaskSchema);
module.exports = {
	Task,
};
