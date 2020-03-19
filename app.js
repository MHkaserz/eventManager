// Import express and the body parser
const express = require('express');
const bodyParser = require('body-parser');

// GraphQL
const graphQLHttp = require('express-graphql');

// Schemas
const { buildSchema } = require('graphql');

// Start the app with the express default function
const app = express();

// Prepare app tp use JSON funcionalities
app.use(bodyParser.json());

// Constant for testing without a Database
const events = [];

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
				owner: Int!
				category: String
			}

			input EventInput {
				title: String!
				description: String!
				price: Float!
				date: String!
				owner: Int!
				category: String
			}

			type RootQuery {
				events: [Event!]!
			}

			type RootMutation {
				createEvent(eventInput: EventInput): Event
			}

			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`),

		rootValue: {
			events: () => {
				return events;
			},

			createEvent: (args) => {
				const event = {
					_id: Math.random().toString(),
					title: args.eventInput.title,
					description: args.eventInput.description,
					price: +args.eventInput.price,
					date: args.eventInput.date,
					owner: args.eventInput.owner,
					category: args.eventInput.category
				};

				// Put the created event in the testing array
				events.push(event);
				return event;

				// TODO: Send the event to the Database
			}
		},

		// For emulation purposes, add '/graphql' to the url to visit the UI
		graphiql: true
}));

// Listening on a local port (start it with npm start in cmd)
app.listen(3000);