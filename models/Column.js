const { Schema, model } = require('mongoose');
const ColumnSchema = Schema({
	columnName: {
		type: String,
		required: [true, 'Column name is required.'],
	},
	tasks: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Task',
		},
	],
	board: {
		type: Schema.Types.ObjectId,
		ref: 'Board',
		required: true,
	},
});
// ColumnSchema.methods.toJSON = function () {
// 	const { __v, _id, ...column } = this.toObject();
// 	column.columnId = _id;
// 	return column;
// };
const Column = model('Column', ColumnSchema);
module.exports = {
	Column,
};
