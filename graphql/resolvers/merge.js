// Helpers
const { dateToString } = require('../../helpers/date');

// DB Models
const Event = require('../../models/event');
const User = require('../../models/user');

// Reshape functions
const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    // Populate the event's owner
    owner: user.bind(this, event.owner)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
    // Populate the booking's user
    bookBy: user.bind(this, booking.bookBy), 
    // Populate the booking's event
    bookFor: bookedEvent.bind(this, booking.bookFor) 
  };
};

const transformUser = user => {
  return {
    ...user._doc,
    birth: dateToString(user._doc.birth),
    // Populate the user's events
    ownes: events.bind(this, user.ownes),
    // Password queries should return null
    password: null 
  };
};

// Merging functions to avoid infinite poulating loops
const events = async eventIds => {
    try {
    	  const events = await Event.find( { _id: { $in: eventIds } } );
    	  return events.map(event => { return transformEvent(event); });
  	} catch (err) { throw err; }
};

const bookedEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return transformEvent(event);
    } catch (err) { throw err; }
};

const user = async userId => {
  	try {
    	  const user = await User.findById(userId);
    	  return transformUser(user);
  	} catch (err) { throw err; }
};

// Exports
exports.transformUser = transformUser;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
