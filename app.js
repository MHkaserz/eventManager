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

// Middleware functions
app.use(
	'/graphql', 
	graphQLHttp({

		schema: buildSchema(`
			type RootQuery {
				events: [String!]!
			}

			type RootMutation {
				createEvent(name: String): String
			}

			schema {
				query: RootQuery
				mutation: RootMutation
			}
		`),

		rootValue: {
			events: () => {
				return ['One', 'Two', 'Three'];
			},

			createEvent: (args) => {
				const eventName = args.name;
				return eventName;
			}
		},

		// For emulation purposes, add '/graphql' to the url to visit the UI
		graphiql: true
}));

// Listening on a local port (start it with npm start in cmd)
app.listen(3000);