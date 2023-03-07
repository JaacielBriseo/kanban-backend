const { Schema, model } = require('mongoose');

const BoardSchema = Schema({
	manager: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	boardName: {
		type: String,
		required: [true, 'Board name is required.'],
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	],
	columns: [
		{
			columnName: { type: String, required: [true, 'Column name is required.'] },
			tasks: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Task',
				},
			],
		},
	],
});

BoardSchema.methods.toJSON = function () {
	const { __v, _id, userId, ...board } = this.toObject();
	board.boardId = _id;
	const { _id: id, ...rest } = board.manager;
	board.manager = rest;
	board.columns = board.columns.map(column => {
		const { _id, ...rest } = column;
		rest.columnId = _id;
		rest.tasks = rest.tasks.map(task => {
			const { __v, _id, manager, assignedTo, ...rest } = task;
			const { _id: idManager, ...restOfManager } = manager;
			let assignedUser = null;
			if (assignedTo) {
				const { _id: idAssignedUser, ...restOfAssignedUser } = assignedTo;
				assignedUser = restOfAssignedUser;
			}
			rest.subtasks = rest.subtasks.map(subtask => {
				const { _id, ...rest } = subtask;
				rest.subtaskId = _id;
				return rest;
			});
			rest.manager = restOfManager;
			rest.assignedTo = assignedUser;
			rest.taskId = _id;
			return rest;
		});
		return rest;
	});
	return board;
};
const Board = model('Board', BoardSchema);
module.exports = {
	Board,
};
