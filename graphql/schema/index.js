// Schemas
const { buildSchema } = require('graphql');

// Builds
module.exports = buildSchema(`
	type Event {
		_id: ID!
		title: String!
		description: String!
		price: Float!
		date: String!
		category: String
		owner: User!
	}

	type User {
		_id: ID!
		email: String!
		password: String
		name: String!
		bio: String
		birth: String!
		ownes: [Event!]
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
`);