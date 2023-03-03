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
			type: Schema.Types.ObjectId,
			ref: 'Subtask',
		},
	],
	column: {
		type: Schema.Types.ObjectId,
		ref: 'Column',
		required: true,
	},
});
// TaskSchema.methods.toJSON = function () {
// 	const { __v, _id, ...task } = this.toObject();
// 	task.taskId = _id;
// 	return task;
// };
const Task = model('Task', TaskSchema);
module.exports = {
	Task,
};
