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
			type: Schema.Types.ObjectId,
			ref: 'Column',
			required: true,
		},
	],
});
// BoardSchema.methods.toJSON = function () {
// 	const { __v, _id, userId, ...board } = this.toObject();
// 	board.boardId = _id;
// 	return board;
// };
const Board = model('Board', BoardSchema);
module.exports = {
	Board,
};
