// Imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transformUser } = require("./transform");

// DB Models 
const User = require('../../models/user');

// rootValue
module.exports = {
  	createUser: async args => {
    	try {
		    // Handle if inputs exists in the Database
		    const existingUser = await User.findOne({ email: args.userInput.email });
		    if (existingUser) { throw new Error('Another user registered with this email.'); }

		    // Encypt the password and create the user then send it to the Database
		    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

		    const user = new User({

		    	email:      args.userInput.email,
		      	password:   hashedPassword,
		        name:       args.userInput.name,
		        bio:        args.userInput.bio,
		        birth:      new Date(args.userInput.birth),
      	});

      	const result = await user.save();
		return transformUser(result);

    } catch (err) { throw err; }
  },

  login: async args => {
  		try{
  			// Handle if user doesn't exist
  			const user = await User.findOne({ email: args.email });
  			if (!user) { throw new Error('User doesn\'t exist'); }

  			// Check the password, then create a token to let the user log in
  			const result = await bcrypt.compare(args.password, user.password);
  			if(!result) { throw new Error('The user credentials you entered are invalid'); }

  			const token = jwt.sign({userId: user.id, email: user.email}, 'mhkaserztokensecurity', {
  				expiresIn: '1h'
  			});

  			return { userId: user.id, token: token, tokenExpiration: 1 }
  		} catch (err) { throw err; }
  }
};