// Imports
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// GraphQL
const graphQLHttp = require('express-graphql');

// Schemas
const { buildSchema } = require('graphql');

// MongoDB Atlas - Mongoose
const mongoose = require('mongoose');

// DB Models
const Event = require('./models/event');
const User = require('./models/user');

// Start the app with the express default function
const app = express();

// Prepare app to use JSON funcionalities
app.use(bodyParser.json());

// Middleware functions
app.use(
	'/graphql', 
	graphQLHttp({

		schema: buildSchema(`
			type Event {
				_id: ID!
				title: String!
				description: String!
				price: Float!
				date: String!
				category: String
			}

			type User {
				_id: ID!
				email: String!
				password: String
				name: String!
				bio: String
				birth: String!
			}

			input EventInput {
				title: String!
				description: String!
				price: Float!
				date: String!
				category: String
			}

			input UserInput {
				email: String!
				password: String!
				name: String!
				bio: String
				birth: String!
			}

			type RootQuery {
				events: [Event!]!
				users: [User!]!
			}

			type RootMutation {
				createEvent(eventInput: EventInput): Event
				createUser(userInput: UserInput): User
			}

			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`),

		rootValue: {
			events: () => {
				return Event.find()
					.then(events => {
						return events.map(event => {
							return {...event._doc, _id: event.id};
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
						createdEvent = {...result._doc, _id: result.id};
						return User.findById('5e7576e2a848053c5c97a65b')
						return {...result._doc, _id: result.id};
					})
					.then(user => {
						if(!user) { throw new Error('Owner doesn\'t exist')}
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
						if (user) {throw new Error('Another user registered with this email')}

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
					return {...result._doc, password: null, _id: result.id};
				})
				.catch(err => {
					throw err;
				});
			}
		},

		// For emulation purposes, add '/graphql' to the url to visit the UI
		graphiql: true
}));

// Connect to the Database
const db = 'mongodb+srv://' + `${process.env.MONGO_USER}` +
		   ':' + `${process.env.MONGO_PASSWORD}` +
		   '@eventmanagermaster-wllz8.mongodb.net/' +
		   `${process.env.MONGO_DB}` +
		   '?retryWrites=true&w=majority';


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		// Listening on a local port if the connection to the DB succeeds 
		app.listen(3000);
	}).catch(err => {
		// TODO: Try to reconnect - Show a page if ultimately failed to reconnect
		throw err; 
	});
