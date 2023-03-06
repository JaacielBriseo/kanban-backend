const { Router } = require('express');
const { validateJWT, validateFields } = require('../middlewares');
const { createTask, updateTask, deleteTask } = require('../controllers/tasks');
const checkRepeatedTaskTitle = require('../middlewares/checkRepeatedTaskTitle');
const router = Router();

router.post('/', [validateJWT, checkRepeatedTaskTitle], createTask);
router.put('/:taskId', [validateJWT, checkRepeatedTaskTitle], updateTask);
router.delete('/:taskId', validateJWT, deleteTask);
module.exports = router;
