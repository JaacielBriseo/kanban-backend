/**Rutas de usuarios /Users
 * host + api/users
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { registerUser, updateUser, deleteUser, getUsers } = require('../controllers/users');
const { isValidRole, checkEmailExists, checkUserById } = require('../helpers/dbValidators');
const { hasRole, isAdminRole, validateFields, validateJWT } = require('../middlewares');

const router = Router();
router.get('/', getUsers);

router.post(
	'/register',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Email is required').isEmail(),
		check('email').custom(checkEmailExists),
		check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
		check('role', 'Role is required.').not().isEmpty(),
		check('role').custom(isValidRole),
		validateFields,
	],
	registerUser
);
router.put(
	'/:id',
	[
		check('id', 'Not a valid id').isMongoId(),
		check('id').custom(checkUserById),
		check('role').custom(isValidRole),
		validateFields,
	],
	updateUser
);
router.delete(
	'/:id',
	[
		validateJWT,
		// isAdminRole,
		hasRole('ADMIN_ROLE', 'USER_ROLE', 'SUPER_USER'),
		check('id', 'Not a valid id').isMongoId(),
		check('id').custom(checkUserById),
		validateFields,
	],
	deleteUser
);

module.exports = router;
