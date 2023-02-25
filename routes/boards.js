const { Router } = require('express');
const { createBoard, fetchBoards, createNewTask, deleteBoard, deleteTask } = require('../controllers/boards');
const router = Router();

router.get('/', fetchBoards);
router.post('/createBoard', createBoard);
router.post('/createTask', createNewTask);
router.delete('/:userId/:boardId', deleteBoard);
router.delete('/:userId/:boardId/:columnId/:taskId', deleteTask);
module.exports = router;
