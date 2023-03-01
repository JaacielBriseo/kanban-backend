const validateFields = require('./validateFields');
const validateJWT = require('./validateJWT');
const validateRoles = require('./validateRoles');
const validateFileToUpload = require('./validateFileToUpload');
const checkBoardOwner = require('./checkBoardOwner');
const checkRepeatedBoardName = require('./checkRepeatedBoardName');
module.exports = {
	...validateFields,
	...validateJWT,
	...validateRoles,
	...validateFileToUpload,
	...checkBoardOwner,
	...checkRepeatedBoardName,
};
