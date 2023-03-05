const { Schema, model } = require('mongoose');

const UserSchema = Schema({
	name: {
		type: String,
		required: [true, 'Name is required.'],
	},
	email: {
		type: String,
		required: [true, 'Email is required.'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required.'],
	},
	img: {
		type: String,
	},
	role: {
		type: String,
		required: true,
		enum: ['MANAGER_ROLE', 'SUPERVISOR_ROLE', 'USER_ROLE'],
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
	boards: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Board',
		},
	],
});
UserSchema.methods.toJSON = function () {
	const { __v, password, _id, ...user } = this.toObject();
	user.uid = _id;
	return user;
};
module.exports = model('User', UserSchema);
