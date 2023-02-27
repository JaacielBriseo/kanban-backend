const { Router } = require('express');
const { getUserBoards, createNewBoard, deleteBoard, updateBoard, updateTask } = require('../controllers/boards');
const { validateJWT, validateFields, hasRole } = require('../middlewares');
const { check } = require('express-validator');
const { checkUserById, checkBoardExists } = require('../helpers/dbValidators');
const router = Router();

//Get user boards
router.get(
	'/:id',
	[validateJWT, check('id', 'A valid user ID is required.').isMongoId(), validateFields],
	getUserBoards
);
//Create a new board
router.post(
	'/',
	[
		validateJWT,
		check('userId', 'A valid user ID is required.').isMongoId(),
		check('boardName', 'A name for the new board is required.').not().isEmpty(),
		validateFields,
	],
	createNewBoard
);
//Delete a board
router.delete(
	'/:id',
	[
		validateJWT,
		check('id', 'Board ID must be a valid ID.').isMongoId(),
		check('id').custom(checkBoardExists),
		validateFields,
	],
	deleteBoard
);
//Update a board
router.put(
	'/:id',
	[validateJWT, check('id', 'Board ID must be a valid ID.').isMongoId(), check('id').custom(checkBoardExists)],
	updateBoard
);
//Update a task
router.put(
	'/:id/task',
	[
		validateJWT,
		check('id', 'Board ID must be a valid ID.').isMongoId(),
		check('taskId', 'Board ID must be a valid ID.').isMongoId(),
		check('boardId', 'Board ID must be a valid ID.').isMongoId(),
		check('id').custom(checkBoardExists),
	],
	updateTask
);
module.exports = router;
