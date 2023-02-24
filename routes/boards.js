const { Router } = require('express');
const { createBoard, fetchBoards, createNewTask } = require('../controllers/boards');
const router = Router();

router.get('/', fetchBoards);
router.post('/createBoard', createBoard);
router.post('/createTask', createNewTask);

module.exports = router;
