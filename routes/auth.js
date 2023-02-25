const { Router } = require('express');
const { check } = require('express-validator');
const { loginUser, revalidateToken, googleSignIn } = require('../controllers/auth');
const { validateFields, validateJWT } = require('../middlewares');

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
router.post(
	'/google',
	[
		//Middlewares
		check('id_token', 'id_token is required.').not().isEmpty(),
		validateFields,
	],
	googleSignIn
);
router.get('/renew', validateJWT, revalidateToken);

module.exports = router;
