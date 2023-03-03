const { Column } = require('../models/Column');

const createColumn = async (req, res) => {
	const { columnName, board } = req.body;
	const column = new Column({ columnName, board });
	await column.save();
	res.json({
		column,
	});
};
const updateColumn = async (req = request, res = response) => {
	const { columnId } = req.params;
	const updatedData = req.body;
	try {
		const column = await Column.findByIdAndUpdate(columnId, updatedData, { new: true });

		res.json({
			ok: true,
			column,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error : ${error}`,
		});
	}
};
const deleteColumn = async (req = request, res = response) => {
	const { columnId } = req.params;
	try {
		const column = await Column.findByIdAndDelete(columnId);

		res.json({
			ok: true,
			deletedColumn: column,
		});
	} catch (error) {
		res.json({
			ok: false,
			msg: `Some error : ${error}`,
		});
	}
};

module.exports = {
	createColumn,
	updateColumn,
	deleteColumn,
};
