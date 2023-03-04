const { Schema, model } = require('mongoose');

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
	board.columns = board.columns.map(column => {
		const { _id, ...rest } = column
		rest.columnId = _id;
		return rest;
	});
	return board;
};
const Board = model('Board', BoardSchema);
module.exports = {
	Board,
};
