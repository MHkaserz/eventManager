// Imports
const jwt = require('jsonwebtoken');

// Authorization handler
module.exports = (req, res, next) => {
	// Check if user is allowed to proceed
	const authHeader = req.get('Authorization'); // Authorization : Bearer xxxxxx
	if(!authHeader) { 
		req.isAuth = false;
		return next();
	}

	// Check if token is valid
	const token = authHeader.split(' ')[1]; // Bearer xxxxxx | We get the xxxxxx
	if(!token || token === '') {
		req.isAuth = false;
		return next();
	}

	let decodedToken;

	// Verify token
	try { decodedToken = jwt.verify(token, 'mhkaserztokensecurity'); } 
	catch(err) { 
		req.isAuth = false;
		return next();
	}

	// One last check
	if(!decodedToken || decodedToken === '') {
		req.isAuth = false;
		return next();
	}

	// Passed all authentication levels
	req.isAuth = true; 
	req.userId = decodedToken.userId; 
	req.tokenExpiration = decodedToken.tokenExpiration;

	// Continue the app
	return next();
}