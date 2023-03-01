const dbValidators = require('./dbValidators');
const generateJWT = require('./generateJWT');
const generateUpdateBoardArgs = require('./generateUpdateBoardArgs');
const googleVerify = require('./googleVerify');
const handleFileUpload = require('./handleFileUpload');

module.exports = {
	...dbValidators,
	...generateJWT,
	...generateUpdateBoardArgs,
	...googleVerify,
	...handleFileUpload,
};
