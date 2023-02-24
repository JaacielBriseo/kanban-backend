const { Router } = require('express');
const { createBoard, fetchBoards, createNewTask, deleteBoard } = require('../controllers/boards');
const router = Router();

router.get('/', fetchBoards);
router.post('/createBoard', createBoard);
router.post('/createTask', createNewTask);
router.delete('/:boardId', deleteBoard);
module.exports = router;
