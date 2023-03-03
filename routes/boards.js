const { Router } = require('express');
const { getUserBoards, createNewBoard, deleteField, updateBoard } = require('../controllers/boards');
const { validateJWT, validateFields } = require('../middlewares');
const { check } = require('express-validator');
const { checkBoardExists } = require('../helpers/dbValidators');
const checkRepeatedBoardName = require('../middlewares/checkRepeatedBoardName');
const checkBoardOwner = require('../middlewares/checkBoardOwner');
const router = Router();

//Get user boards
router.get('/', validateJWT, getUserBoards);

//Create a new board
router.post(
	'/',
	[
		validateJWT,
		check('boardName', 'A name for the new board is required.').not().isEmpty(),
		checkRepeatedBoardName,
		validateFields,
	],
	createNewBoard
);

//Delete a board or a field depending on params.
router.delete(
	'/:boardId/:columnId/:taskId',
	[
		validateJWT,
		check('boardId', 'Board ID must be a valid ID.').isMongoId(),
		check('boardId').custom(checkBoardExists),
		checkBoardOwner,
		validateFields,
	],
	deleteField
);

//Update a board
router.put(
	'/:boardId',
	[
		validateJWT,
		check('boardId', 'Board ID must be a valid ID.').isMongoId(),
		check('boardId').custom(checkBoardExists),
		checkBoardOwner,
		validateFields,
	],
	updateBoard
);

module.exports = router;
