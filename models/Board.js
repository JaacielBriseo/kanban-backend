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
});

const TaskSchema = Schema({
	title: {
		type: String,
		required: [true, 'Task title is required.'],
	},
	description: {
		type: String,
	},
	status: {
		type: String,
	},
	statusId: {
		type: String,
	},
	subtasks: [SubtaskSchema],
});

const ColumnSchema = Schema({
	columnName: {
		type: String,
		required: [true, 'Column name is required.'],
	},
	tasks: [TaskSchema],
});

const BoardSchema = Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	boardName: {
		type: String,
		required: [true, 'Board name is required.'],
	},
	columns: [ColumnSchema],
});

module.exports = model('Board', BoardSchema);
