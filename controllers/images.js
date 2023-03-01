const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');
const { handleFileUpload } = require('../helpers');

const User = require('../models/User');

//! Load files
const loadFiles = async (req = request, res = response) => {
	try {
		const name = await handleFileUpload(req.files);
		res.json({
			ok: true,
			name,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: `${error}`,
		});
	}
};

//! Show Image to the user
const showImage = async (req = request, res = response) => {
	const { id, collection } = req.params;
	let model;
	switch (collection) {
		case 'users':
			model = await User.findById(id);
			if (!model) {
				return res.status(400).json({
					ok: false,
					msg: `No user with ID :${id}`,
				});
			}
			break;

		default:
			return res.status(500).json({ msg: `Unvalid for now.` });
	}
	//* Clean previous images
	if (model.img) {
		//* Delete image from server
		const imagePath = path.join(__dirname, '../uploads', collection, model.img);
		if (fs.existsSync(imagePath)) {
			return res.sendFile(imagePath);
		}
	}

	const defaultImgPath = path.join(__dirname, '../assets/no-image.jpg');
	res.sendFile(defaultImgPath);
};

//! Update user image in cloudinary
const updateImageCloudinary = async (req = request, res = response) => {
	const { id, collection } = req.params;
	let model;
	switch (collection) {
		case 'users':
			model = await User.findById(id);
			if (!model) {
				return res.status(400).json({
					ok: false,
					msg: `No user with ID :${id}`,
				});
			}
			break;

		default:
			return res.status(500).json({ msg: `Unvalid for now.` });
	}
	//* Clean previous images
	if (model.img) {
		const splittedImgPath = model.img.split('/');
		const lastSegment = splittedImgPath[splittedImgPath.length - 1];
		const [public_id] = lastSegment.split('.');
		await cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.file;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

	model.img = secure_url;
	await model.save();

	res.json({
		ok: true,
		model,
	});
};

module.exports = {
	loadFiles,
	updateImageCloudinary,
	showImage,
	// updateImage,
};

// const updateImage = async (req = request, res = response) => {
// 	const { id, collection } = req.params;
// 	let model;
// 	switch (collection) {
// 		case 'users':
// 			model = await User.findById(id);
// 			if (!model) {
// 				return res.status(400).json({
// 					ok: false,
// 					msg: `No user with ID :${id}`,
// 				});
// 			}
// 			break;

// 		default:
// 			return res.status(500).json({ msg: `Unvalid for now.` });
// 	}
// 	//Clean previous images
// 	if (model.img) {
// 		//Delete image from server
// 		const imagePath = path.join(__dirname, '../uploads', collection, model.img);
// 		if (fs.existsSync(imagePath)) {
// 			fs.unlinkSync(imagePath);
// 		}
// 	}

// 	const name = await handleFileUpload(req.files, undefined, collection);
// 	model.img = name;
// 	await model.save();

// 	res.json({
// 		ok: true,
// 		model,
// 	});
// };
