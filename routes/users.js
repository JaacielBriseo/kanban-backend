/**Rutas de usuarios /Users
 * host + api/users
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { registerUser, updateUser, deleteUser, getUsers } = require('../controllers/users');
const { checkEmailExists, checkUserById } = require('../helpers/dbValidators');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();
router.get('/', getUsers);

router.post(
	'/register',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Email is required').isEmail(),
		check('email').custom(checkEmailExists),
		check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
		validateFields,
	],
	registerUser
);
router.put(
	'/:id',
	[check('id', 'Not a valid id').isMongoId(), check('id').custom(checkUserById), validateFields],
	updateUser
);
router.delete(
	'/:id',
	[validateJWT, check('id', 'Not a valid id').isMongoId(), check('id').custom(checkUserById), validateFields],
	deleteUser
);

module.exports = router;
