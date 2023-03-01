/**Route for images /images
 * host + api/images
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { loadFiles, showImage, updateImageCloudinary } = require('../controllers/images');
const { validateFields, validateFileToUpload } = require('../middlewares');
const { validCollections } = require('../helpers');

const router = Router();

router.post('/', validateFileToUpload, loadFiles);

router.put(
	'/:collection/:id',
	[
		validateFileToUpload,
		check('id', 'ID must be a valida ID.').isMongoId(),
		check('collection').custom(collection => validCollections(collection, ['users'])),
		validateFields,
	],
	updateImageCloudinary
);

router.get(
	'/:collection/:id',
	[
		check('id', 'ID must be a valida ID.').isMongoId(),
		check('collection').custom(collection => validCollections(collection, ['users'])),
		validateFields,
	],
	showImage
);

module.exports = router;
