// Imports
const { transformBooking, transformEvent } = require('./merge');

// DB Models 
const Booking = require('../../models/booking');
const Event = require('../../models/event');

// rootValue
module.exports = {
  	bookings: async () => {
    	try {
      		const bookings = await Booking.find();
      		return bookings.map(booking => {
        		return transformBooking(booking);
      		})
    	} catch (err) { throw err; }
  	},

  	bookEvent: async args => {
    	try {
      		// TODO: Handle if booking already exists

      		// Find the event in the DB then create a new booking with its ID for the user ID
      		const fetchedEvent = await Event.findOne( { _id: args.eventId } );
      		const booking = new Booking({

        		bookBy:     '5e7576e2a848053c5c97a65b', // TODO: get the owner dynamically
        		bookFor:    fetchedEvent

      	});

      	const result = await booking.save();
      	return transformBooking(result);
    	} catch (err) { throw err; }
  	},

  	cancelBooking: async args => {
    	try {
      		// TODO: Handle if booking doesn't exist

      		// Find the booking in the DB then remove it and all its dependencies
      		const booking = await Booking.findById(args.bookingId).populate('bookFor');
      		const event = transformEvent(booking.bookFor);

      		await Booking.deleteOne( { _id: args.bookingId } );
      		return event;
    } catch (err) { throw err; }
  }
};