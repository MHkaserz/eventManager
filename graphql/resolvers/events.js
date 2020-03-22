// Imports
const { transformEvent } = require('./transform');

// DB Models 
const Event = require('../../models/event');
const User = require('../../models/user');

// rootValue
module.exports = {
  	events: async () => {
    	try {
    		const events = await Event.find();
    		return events.map(event => { return transformEvent(event); });
    	} catch (err) { throw err; }
  	},

  	createEvent: async args => {
    	// Create the event
		const event = new Event({

	  		title:        args.eventInput.title,
	  		description:  args.eventInput.description,
	  		price:        +args.eventInput.price,
	  		date:         new Date(args.eventInput.date),
	  		category:     args.eventInput.category,
	  		owner:        '5e7576e2a848053c5c97a65b' // TODO: get the owner dynamically

		}); 

    	let createdEvent;

    	try {
    		// Send the event to the Database, then add it to its owner in Users
    		const result = await event.save();
    		createdEvent = transformEvent(result);

    		const owner = await User.findById('5e7576e2a848053c5c97a65b'); // TODO: get the owner dynamically

			if (!owner) { throw new Error('Owner doesn\'t exist'); }
			owner.ownes.push(event);
			await owner.save();
			return createdEvent;
    	} catch (err) { throw err; }
  	}
};