const { Router } = require('express');
const { validateJWT, validateFields } = require('../middlewares');
const { check } = require('express-validator');
const { createSubtask, updateSubtask, deleteSubtask } = require('../controllers/subtasks');
const router = Router();

router.post('/', validateJWT, createSubtask);
router.put('/:subtaskId', updateSubtask);
router.delete('/:subtaskId', deleteSubtask);

module.exports = router;
