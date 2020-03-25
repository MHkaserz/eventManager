// Imports
const express = require('express');
const bodyParser = require('body-parser');
const isAuth = require('./middleware/isauth');
const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');

// GraphQL
const graphQLHttp = require('express-graphql');

// MongoDB Atlas - Mongoose
const mongoose = require('mongoose');

// Start the app with the express default function
const app = express();

// Prepare app to use JSON funcionalities
app.use(bodyParser.json());

// Middleware functions
app.use(isAuth);

app.use(
	'/graphql', 
	graphQLHttp({

		schema: graphQLSchema,
		rootValue: graphQLResolvers,

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
