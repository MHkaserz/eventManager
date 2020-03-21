// Imports
const bcrypt = require('bcryptjs');

// DB Models
const Event = require('../../models/event');
const User = require('../../models/user');

// Merging functions
const events = eventsIds => {
	return Event.find( { _id: {$in: eventsIds} } )
		.then(events => {
			return events.map(event => {
				// Populate the event's owner
				return {
					...event._doc, 
					date: new Date(event._doc.date).toISOString(),
					owner: user.bind(this, event.owner)
				};
			})
		})
		.catch(err => {
			throw err;
		})
}

const user = userId => {
	return User.findById(userId)
		.then(user => {
			// Populate the user's events
			return {
				...user._doc,
				birth: new Date(user._doc.birth).toISOString(),
				ownes: events.bind(this, user.ownes),
				password: null // Password queries should return null
			};
		})
		.catch(err => {
			throw err;
		})
}

// rootValue
module.exports = {
	events: () => {
		return Event.find()
		.then(events => {
			return events.map(event => {
				// Populating owner of an event manually to avoid infinite poulating loops
				return {
					...event._doc, 
					date: new Date(event._doc.date).toISOString(),
					owner: user.bind(this, event.owner)
				}; 
			})
		})
		.catch(err => {
			throw err;
		});
	},

	createEvent: (args) => {
	// Create the event
	const event = new Event({
		title: args.eventInput.title,
		description: args.eventInput.description,
		price: +args.eventInput.price,
		date: new Date(args.eventInput.date),
		category: args.eventInput.category,
		owner: '5e7576e2a848053c5c97a65b' // TODO: get the owner dynamically
	}); let createdEvent;

	// GSend the event to the Database, then add it to its owner in Users
	return event
		.save()
		.then(result => {
			createdEvent = { 
				...result._doc,
				date: new Date(event._doc.date).toISOString(),
				owner: user.bind(this, result.owner) 
			};
			return User.findById('5e7576e2a848053c5c97a65b')
			return result;
		})
		.then(user => {
			if(!user) { throw new Error('Owner doesn\'t exist') }
			user.ownes.push(event);
			return user.save();
		})
		.then(result => {
			return createdEvent;
		})
		.catch(err => {
			throw err;
		});
	},

	createUser: (args) => {
		// Handle if inputs exists in the Database
		return User
			.findOne({email: args.userInput.email})
			.then(user => {
				if (user) { throw new Error('Another user registered with this email') }

		// Encypt the password and create the user then send it to the Database
		return bcrypt
			.hash(args.userInput.password, 12);
		})
		.then(hashedPassword => {
			const user = new User({
				email: args.userInput.email,
				password: hashedPassword,
				name: args.userInput.name,
				bio: args.userInput.bio,
				birth: new Date(args.userInput.birth)
			});
			return user.save();
		})
		.then(result => {
			// Password quiries should return null
			return {
				...result._doc,
				birth: new Date(user._doc.birth).toISOString(),
				password: null // Password queries should return null
			};
		})
		.catch(err => {
			throw err;
		});
	}
}
