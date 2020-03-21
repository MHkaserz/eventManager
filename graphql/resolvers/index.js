// Imports
const bcrypt = require('bcryptjs');

// DB Models
const Event = require('../../models/event');
const User = require('../../models/user');

// Merging functions
const events = async eventIds => {
  	try {

    	const events = await Event.find( { _id: { $in: eventIds } } );
    	return events.map(event => {
      		return {
        		...event._doc,
        		date: new Date(event._doc.date).toISOString(),
        		// Populate the event's owner
        		owner: user.bind(this, event.owner)
      		};
    	});

  	} catch (err) { throw err; }
};

const user = async userId => {
  	try {

    	const user = await User.findById(userId);
    	return {
			...user._doc,
			birth: new Date(user._doc.birth).toISOString(),
			ownes: events.bind(this, user.ownes),
			password: null // Password queries should return null
		};

  	} catch (err) { throw err; }
};

// rootValue
module.exports = {
  events: async () => {
    try {

      	const events = await Event.find();
      	return events.map(event => {
        	// Populating owner of an event manually to avoid infinite poulating loops
			return {
				...event._doc, 
				date: new Date(event._doc.date).toISOString(),
				owner: user.bind(this, event.owner)
			}; 
      	});

    } catch (err) { throw err; }
  },

  createEvent: async args => {

    // Create the event
	const event = new Event({
		title: args.eventInput.title,
		description: args.eventInput.description,
		price: +args.eventInput.price,
		date: new Date(args.eventInput.date),
		category: args.eventInput.category,
		owner: '5e7576e2a848053c5c97a65b' // TODO: get the owner dynamically
	}); let createdEvent;

    try {

    	// Send the event to the Database, then add it to its owner in Users
    	const result = await event.save();

    	createdEvent = { 
			...result._doc,
			date: new Date(event._doc.date).toISOString(),
			owner: user.bind(this, result.owner) 
		};

      	const owner = await User.findById('5e7576e2a848053c5c97a65b'); // TODO: get the owner dynamically

      	if (!owner) { throw new Error('Owner doesn\'t exist'); }
      	owner.ownes.push(event);
      	await owner.save();

      	return createdEvent;

    } catch (err) { throw err; }
  },

  createUser: async args => {

    try {

    	// Handle if inputs exists in the Database
      	const existingUser = await User.findOne({ email: args.userInput.email });
      	if (existingUser) { throw new Error('Another user registered with this email.'); }

      	// Encypt the password and create the user then send it to the Database
      	const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      	const user = new User({
        	email: args.userInput.email,
        	password: hashedPassword
      	});

      	const result = await user.save();

		return {
			...result._doc,
			birth: new Date(user._doc.birth).toISOString(),
			password: null // Password queries should return null
		};

    } catch (err) { throw err; }
  }
};