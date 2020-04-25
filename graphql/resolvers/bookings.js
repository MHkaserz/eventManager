// Imports
const { transformBooking, transformEvent } = require('./transform');

// DB Models 
const Booking = require('../../models/booking');
const Event = require('../../models/event');

// rootValue
module.exports = {
  	bookings: async (args, req) => {
        // Check authentication
        if(!req.isAuth) { throw new Error('Denied!'); }

    	try {
      		    const bookings = await Booking.find({ bookBy: req.userId });
      		    return bookings.map(booking => {
        		    return transformBooking(booking);
      		    })
    	} catch (err) { throw err; }
  	},

  	bookEvent: async (args, req) => {
        // Check authentication
        if(!req.isAuth) { throw new Error('Denied!'); }

    	try {
                // Handle if the booking exist in the Database
                const fetchedBooking = await Booking.findOne({ bookFor: args.eventId, bookBy: req.userId });
                if(fetchedBooking) { throw new Error('You already booked this event!'); }

          		// Find the event in the DB then create a new booking with its ID for the user ID
          		const fetchedEvent = await Event.findOne( { _id: args.eventId } );
          		const booking = new Booking({

            		bookBy:     req.userId,
            		bookFor:    fetchedEvent

      	        });

      	        const result = await booking.save();

      	        return transformBooking(result);
    	} catch (err) { throw err; }
  	},

  	cancelBooking: async (args, req) => {
        // Check authentication
        if(!req.isAuth) { throw new Error('Denied!'); }

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