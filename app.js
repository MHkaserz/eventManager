// Import express and the body parser
const express = require('express');
const bodyParser = require('body-parser');

// Start the app with the express default function
const app = express();

// Prepare app tp use JSON funcionalities
app.use(bodyParser.json());

// Middleware functions
app.get('/', (req, res, next) => {
	res.send('Your request was accepted');
})

// Listening on a local port (start it with npm start in cmd)
app.listen(3000);