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
BoardSchema.methods.toJSON = function () {
	const { __v, _id, userId, ...board } = this.toObject();
	board.boardId = _id;
	board.columns = board.columns.map(column => {
		const { _id, ...rest } = column;
		rest.columnId = _id;
		rest.tasks = rest.tasks.map(task => {
			const { _id, ...rest } = task;
			rest.taskId = _id;
			rest.subtasks = rest.subtasks.map(subtask => {
				const { _id, ...rest } = subtask;
				rest.subtaskId = _id;
				return rest;
			});
			return rest;
		});
		return rest;
	});
	return board;
};
module.exports = model('Board', BoardSchema);
