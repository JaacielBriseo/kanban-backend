const { Router } = require('express');
const { fetchBoards, createBoard } = require('../controllers/boards');
const { validateJWT,validateFields } = require('../middlewares');
const { check } = require('express-validator');
const router = Router();

router.get('/', fetchBoards);
router.post('/',[
  validateJWT,
  check('boardName','Name field is required.').not().isEmpty(),
  check('userId','User ID to create a board is required.').not().isEmpty(),
  validateFields
],createBoard)
module.exports = router;
