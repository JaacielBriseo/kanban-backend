const { Router } = require('express');
const { validateJWT, validateFields } = require('../middlewares');
const { check } = require('express-validator');
const { createTask, updateTask, deleteTask } = require('../controllers/tasks');
const router = Router();

router.post('/', validateJWT, createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);
module.exports = router;
