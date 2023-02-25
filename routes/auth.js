const { Router } = require('express');
const { check } = require('express-validator');
const { loginUser, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();

router.post(
	'/login',
	[
		//Middlewares
		check('email', 'Email is required.').isEmail(),
		check('password', 'Password is required.').not().isEmpty(),
		check('password', 'Password must be at least 6 characters.').isLength({ min: 6 }),
		validateFields,
	],
	loginUser
);
router.get('/renew', validateJWT, revalidateToken);

module.exports = router;
