const { Router } = require('express');
const { validateJWT } = require('../middlewares');
const { createTask, updateTask, deleteTask } = require('../controllers/tasks');
const router = Router();

router.post('/', validateJWT, createTask);
router.put('/:taskId', validateJWT, updateTask);
router.delete('/:taskId', validateJWT, deleteTask);
module.exports = router;
