const { Router } = require('express');
const { validateJWT, validateFields } = require('../middlewares');
const { check } = require('express-validator');
const { createColumn, updateColumn, deleteColumn } = require('../controllers/columns');
const router = Router();

router.post('/', validateJWT,createColumn);
router.put('/:columnId', updateColumn);
router.delete('/:columnId', deleteColumn);
module.exports = router;
