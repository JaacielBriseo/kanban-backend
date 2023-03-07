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
	const { _id: id, ...restOfBoardManager } = board.manager;
	board.members = board.members.map(member => {
		const { _id, ...restOfMember } = member;
		return restOfMember;
	});
	board.manager = restOfBoardManager;
	board.columns = board.columns.map(column => {
		const { _id, ...restOfColumn } = column;
		restOfColumn.columnId = _id;
		restOfColumn.tasks = restOfColumn.tasks.map(task => {
			const { __v, _id, manager, assignedTo, ...restOfTask } = task;
			const { _id: idManager, ...restOfManager } = manager;
			let assignedUser = null;
			if (assignedTo) {
				const { _id: idAssignedUser, ...restOfAssignedUser } = assignedTo;
				assignedUser = restOfAssignedUser;
			}
			restOfTask.subtasks = restOfTask.subtasks.map(subtask => {
				const { _id, ...restOfSubtask } = subtask;
				restOfSubtask.subtaskId = _id;
				return restOfSubtask;
			});
			restOfTask.manager = restOfManager;
			restOfTask.assignedTo = assignedUser;
			restOfTask.taskId = _id;
			return restOfTask;
		});
		return restOfColumn;
	});
	return board;
};
const Board = model('Board', BoardSchema);
module.exports = {
	Board,
};
