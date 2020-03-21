// MongoDB Atlas - Mongoose
const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const eventSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now
	},
	category: {
		type: String,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	}
});

// Models
module.exports = mongoose.model('Event', eventSchema);