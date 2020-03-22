// MongoDB Atlas - Mongoose
const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
	bookBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	bookFor: {
		type: Schema.Types.ObjectId,
		ref: 'Event'
	}
}, { timestamps: true} );

// Models
module.exports = mongoose.model('Booking', bookingSchema);