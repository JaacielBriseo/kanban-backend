const path = require('path');
const { v4: uuidv4 } = require('uuid');
const handleFileUpload = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg'], folder = '') => {
	return new Promise((resolve, reject) => {
		const { file } = files;
		const splittedName = file.name.split('.');
		const extension = splittedName[splittedName.length - 1];

		//* Validate file extension (In this case we are allowing only images.)
		if (!validExtensions.includes(extension)) {
			return reject(`Files with .${extension} is not valid, these are the valid files: ${validExtensions}`);
		}
		const temporalName = uuidv4() + '.' + extension;
		const uploadPath = path.join(__dirname, '../uploads/', folder, temporalName);

		file.mv(uploadPath, err => {
			if (err) {
				reject(err);
			}

			resolve(temporalName);
		});
	});
};
module.exports = {
	handleFileUpload,
};
