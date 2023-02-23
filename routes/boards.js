const { Router } = require('express');
const { createBoard, fetchBoards } = require('../controllers/boards');
const router = Router();

router.get('/',fetchBoards);
router.post('/createBoard',createBoard);

module.exports = router;