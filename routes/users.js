/**Rutas de usuarios /Users
 * host + api/users
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { registerUser, updateUser, deleteUser, getUsers } = require('../controllers/users');
const { validateFields } = require('../middlewares/validateFields');
const { isValidRole, checkEmailExists, checkUserById } = require('../helpers/dbValidators');

const router = Router();
router.get('/', getUsers);
// router.post(
// 	'/',
// 	[
// 		//Middlewares
// 		check('email', 'Email is required').isEmail(),
// 		check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
// 		validateFields,
// 	],
// 	loginUser
// );

router.post(
	'/register',
	[
		//Middlewares
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Email is required').isEmail(),
		check('email').custom(checkEmailExists),
		check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
		check('role', 'Role is required.').not().isEmpty(),
		check('role').custom(isValidRole),
		// check('role', 'Not a valid role.').isIn(['ADMIN_ROLE', 'USER_ROLE', 'SUPER_ROLE']),
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
	[check('id', 'Not a valid id').isMongoId(), check('id').custom(checkUserById), validateFields],
	deleteUser
);
// router.get('/renew', validateJWT, revalidateToken);

module.exports = router;
