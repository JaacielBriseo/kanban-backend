const { Schema, model } = require('mongoose');
const SubtaskSchema = Schema({
	title: {
		type: String,
		required: [true, 'Subtask title is required.'],
	},
	isCompleted: {
		type: Boolean,
		required: true,
		default: false,
	},
	task: {
		type: Schema.Types.ObjectId,
		ref: 'Task',
		required: true,
	},
});
// SubtaskSchema.methods.toJSON = function () {
// 	const { __v, _id, ...subtask } = this.toObject();
// 	subtask.subtaskId = _id;
// 	return subtask;
// };
const Subtask = model('Subtask', SubtaskSchema);
module.exports = {
	Subtask,
};
