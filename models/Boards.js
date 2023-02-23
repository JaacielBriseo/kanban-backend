const { Schema, model } = require('mongoose');
const subtaskSchema = Schema(
	{
		title: { type: String, required: false },
		isCompleted: { type: Boolean },
		subtaskId: { type: String, required: false },
	},
	{ _id: false }
);

const taskSchema = Schema(
	{
		title: { type: String, required: false },
		description: { type: String, required: false },
		status: { type: String, required: false },
		taskId: { type: String, required: false },
		statusId: { type: String, required: false },
		subtasks: [subtaskSchema],
	},
	{ _id: false }
);

const columnSchema = Schema({
	name: { type: String, required: false },
	columnId: { type: String, required: false },
	tasks: [taskSchema],
});

const boardSchema = Schema(
	{
		name: { type: String, required: false },
		boardId: { type: String, required: false },
		columns: [columnSchema],
	},
	{ _id: false }
);

const BoardsSchema = Schema({
	userId: { type: String, required: true },
	boards: [boardSchema],
});

module.exports = model('Boards', BoardsSchema);
// module.exports = model(
// 	'Boards',
// 	BoardsSchema.method('toJSON', function toJSON() {
// 		const { __v, _id, userId, ...object } = this.toObject();
// 		return {
// 			...object,
// 		};
// 	})
// );
