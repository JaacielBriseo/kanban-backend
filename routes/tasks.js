const { Router } = require('express');
const { validateJWT } = require('../middlewares');
const { createTask, updateTask, deleteTask, assignUserToTask } = require('../controllers/tasks');
const checkRepeatedTaskTitle = require('../middlewares/checkRepeatedTaskTitle');
const authorizeTaskUpdate = require('../middlewares/authorizeTaskUpdate');
const router = Router();

router.post('/', [validateJWT, checkRepeatedTaskTitle], createTask);
router.put('/:taskId', [validateJWT, checkRepeatedTaskTitle, authorizeTaskUpdate], updateTask);
router.put('/:taskId/assignUser', validateJWT, assignUserToTask);
router.delete('/:taskId', validateJWT, deleteTask);
module.exports = router;
