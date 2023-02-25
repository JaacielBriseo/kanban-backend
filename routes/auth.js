/**Rutas de usuarios /Auth
 * host + api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isValidRole, checkEmailExists } = require('../helpers/dbValidators');

const router = Router();

router.post(
	'/',
	[
		//Middlewares
		check('email', 'Email is required').isEmail(),
		check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
		validateFields,
	],
	loginUser
);

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

router.get('/renew', validateJWT, revalidateToken);

module.exports = router;
