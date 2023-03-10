const { Router } = require('express');
const { getUserBoards, createNewBoard, deleteBoard, updateBoard, addMemberToBoard, getBoardById } = require('../controllers/boards');
const { validateJWT, validateFields } = require('../middlewares');
const { check } = require('express-validator');
const { checkBoardExists } = require('../helpers/dbValidators');
const checkRepeatedBoardName = require('../middlewares/checkRepeatedBoardName');
const checkBoardOwner = require('../middlewares/checkBoardOwner');
const router = Router();

//Get user boards
router.get('/', validateJWT, getUserBoards);

router.get('/:boardId', validateJWT, getBoardById);

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

//Delete a board.
router.delete(
	'/:boardId',
	[
		validateJWT,
		check('boardId', 'Board ID must be a valid ID.').isMongoId(),
		check('boardId').custom(checkBoardExists),
		checkBoardOwner,
		validateFields,
	],
	deleteBoard
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

//* Add member to a board so they can have access.
router.post(
	'/:boardId/members',
	[
		validateJWT,
		check('boardId', 'Board ID must be a valid ID.').isMongoId(),
		check('boardId').custom(checkBoardExists),
		checkBoardOwner,
		validateFields,
	],
	addMemberToBoard
);

module.exports = router;
