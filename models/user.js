// MongoDB Atlas - Mongoose
const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	bio: {
		type: String,
	},
	birth: {
		type: Date,
		required: true
	},
	ownes: [{
		type: Schema.Types.ObjectId,
		ref: 'Event',
	}]
});

// Models
module.exports = mongoose.model('User', userSchema);