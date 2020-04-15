// Schemas
const { buildSchema } = require('graphql');

// Builds
module.exports = buildSchema(`
	type User {
		_id: ID!
		email: String!
		password: String
		name: String!
		bio: String
		birth: String!
		ownes: [Event!]
	}

	type AuthData {
		userId: ID!
		token: String!
		tokenExpiration: Int!
	}

	type Event {
		_id: ID!
		title: String!
		description: String!
		price: Float!
		date: String!
		category: String
		owner: User!
	}

	type Booking {
		_id: ID!
		bookBy: User!
		bookFor: Event!
		createdAt: String!
		updatedAt: String!
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
		bookings: [Booking!]!
		login(email: String!, password: String!): AuthData
	}

	type RootMutation {
		createEvent(eventInput: EventInput): Event
		createUser(userInput: UserInput): User
		bookEvent(eventId: ID!): Booking
		cancelBooking(bookingId: ID!): Event!
	}

	schema {
		query: RootQuery
		mutation: RootMutation
	}
`);