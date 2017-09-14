"use strict";
var mongoose = require('mongoose'),
	User = mongoose.model('Users'),
	Restroom = mongoose.model('Restrooms'),
	strings = require('../../private_strings'),
	stripe = require('stripe')(strings.STRIPE_SECRET_KEY),
	express_jwt = require('express-jwt'),
	jwt = require('jsonwebtoken');

// This function ensures the client making a request has authorized access
var check_api_key = function(req, res, next) {
	if (!req.get("Authorization")) {
		// API key was not sent
		res.status(401).json({ error: 'Unauthorized access. Authorization header must be provided' });
	} else if (req.get("Authorization") !== strings.API_KEY) {
		// Invalid API key sent
		res.status(401).json({ error: 'Unauthorized access. Authorization header does not match server API key' });
	} else {
		// Client is authorized, move on to specific request
		next();
	}
};

// This function makes a charge to a card
//
// TEST FUNCTION
//
var create_charge = function(req, res) {
	if (!req.query.stripe_token) {
		// Stripe token was not passed - send error to client
		res.status(400).json({ error: 'Query parameter stripe_token is required' });
	} else if (!req.query.amount) {
		// Amount not specified
		res.status(400).json({ error: 'Query parameter amount is required' });
	} else {
		var token = req.query.stripe_token;

		// Charge card
		stripe.charges.create({
			amount: req.query.amount,
			currency: "usd",
			description: "test charge",
			source: token
		}, function(err, charge) {
			if (err) {
				// There was an error with the charge
				res.status(500).send(err);
			} else {
				// Charge was completed successfully
				res.status(200).json(charge);
			}
		});
	}
};

/*
 * USER FUNCTIONS
 */

// This function fetches a user
var get_user = function(req, res) {
	// Find user with matching ID
	User.findById(req.params.id, function(err, user) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send(err);
		} else if (user === null) {
			// If user is null, send back error to client
			res.status(404).json({ error: 'User not found' });
		} else {
			// User was found - return to client
			res.status(200).send(user);
		}
	});
};

// This function creates a user
var create_user = function(req, res) {
	var newUser = new User(req.body);
	newUser.save(function(err, user) {
		// If there was an error, send it back to the client
		if (err) {
			res.status(500).send(err);
		} else {
			// User was created - return to client
			res.status(201).json(user);
		}
	});
};

// This function updates a user
var update_user = function(req, res) {
	User.findOneAndUpdate({_id: req.params.id }, req.body, { new: true }, function(err, user) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send(err);
		} else {
			// User was updated - return to client
			res.status(200).json(user);
		}
	});
};

// This function deletes a user
var delete_user = function(req, res) {
	// Delete user
	User.findByIdAndRemove(req.params.id, function(err, user) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send(err);
		} else if (user === null) {
			// If user is null, send back error to client
			res.status(404).json({ error: 'User not found' });
		} else {
			// User was found and deleted - return to client
			res.status(200).json({ message: 'User successfully deleted' });
		}
	});
}

/*
 * RESTROOM FUNCTIONS
 */

// This function fetches a restroom
var get_restroom = function(req, res) {
	// Find restroom with matching ID
	Restroom.findById(req.params.id, function(err, restroom) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send(err);
		} else if (restroom === null) {
			// If restroom is null, send back error to client
			res.status(404).json({ error: 'Restroom not found' });
		} else {
			// Restroom was found - return to client
			res.status(200).send(restroom);
		}
	});
};

// This function creates a restroom
var create_restroom = function(req, res) {
	var new_restroom = new Restroom(req.body);
	new_restroom.save(function(err, restroom) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send(err);
		} else {
			// Restroom was created - return to client
			res.status(201).json(restroom);
		}
	});
};

// This method updates a restroom
var update_restroom = function(req, res) {
	Restroom.findOneAndUpdate({_id: req.params.id }, req.body, { new: true }, function(err, restroom) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send(err);
		} else {
			// Restroom was updated - return to client
			res.status(200).json(restroom);
		}
	});
};

// This function deletes a restroom
var delete_restroom = function(req, res) {
	// Delete restroom
	Restroom.findByIdAndRemove(req.params.id, function(err, restroom) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send(err);
		} else if (restroom === null) {
			// If restroom is null, send back error to client
			res.status(404).json({ error: 'Restroom not found' });
		} else {
			// Restroom was found and deleted - return to client
			res.status(200).json({ message: 'Restroom successfully deleted' });
		}
	});
}

// This function gets restrooms in a given area
var get_area_restrooms = function(req, res) {
	if (!req.query.min_lat || !req.query.max_lat || !req.query.min_lng || !req.query.max_lng) {
		// Latitudes and longitudes were not all passed - return error
		res.status(401).json({ error: 'Query parameters min_lat, max_lat, min_lng, and max_lng must all be passed' });
	} else {
		// Find restrooms in the given latitude and longitude ranges
		Restroom.find({
			lat: { $gt: req.query.min_lat, $lt: req.query.max_lat },
			lng: { $gt: req.query.min_lng, $lt: req.query.max_lng }
		}, function(err, restrooms) {
			if (err) {
				// If there was an error, return it to the user
				res.status(500).send(err);
			} else {
				// Query successful - return restrooms to user
				res.status(200).json(restrooms);
			}
		});
	}
};

/*
 * AUTH & LOGIN FUNCTIONS
 */


var create_token = function(auth) {
  return jwt.sign({
    id: auth.id
  }, strings.TOKEN_GEN_SECRET,
  {
    expiresIn: 60 /* * 60 * 24 * 30 * 6 // ~6 month expiration */
  });
};

var generate_token = function (req, res, next) {
  req.token = create_token(req.auth);
  next();
};

var send_token = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  res.status(200).send(req.auth);
};

var check_auth = function(req, res, next) {
	if (!req.user) {
		// User is not authenticated - return
		return res.send(401, "User not authenticated");
	}

	// Prepare token for API
	req.auth = {
		id: req.user.id
	}

	next();
};

// This function returns a user, creating a new one if necessary
var upsert_fb_user = function(req, res, next) {
	// Find user with matching facbook_id
	return User.findOne({ 
		'facebook_id': req.params.id 
	}, function(err, user) {
		if (!user) {
			// If user is null, create new one
			var newUser = new User(req.body);

			// Save new user
			newUser.save(function(error, savedUser) {
				if (error) {
					// Handle error
					console.log(error);
				}
				req.user = savedUser;
				return next();
			});
		} else if (!err) {
			// If user was found, return data
			req.user = user;
			// Move on
			return next();
		}
	});
};

var authenticate = express_jwt({
	secret: strings.TOKEN_GEN_SECRET,
	requestProperty: 'auth',
	get_token: function(req) {
		if (req.headers['x-auth-token']) {
			console.log("\n\nx-auth-token proided\n\n");
			// Token is valid
			return req.headers['x-auth-token'];
		}
		console.log("\n\nx-auth-token not proided\n\n");
		// Token is not valid
		return null;
	}
});

var get_current_user = function(req, res, next) {
  User.findById(req.auth.id, function(err, user) {
    if (err) {
    	console.log("\n\nerror: %s\n\n", err);
      	next(err);
    } else {
    	console.log("\n\nNo error\n\n");
      	req.user = user;
      	next();
    }
  });
};

var get_one = function (req, res) {
  var user = req.user.toObject();

  delete user['__v'];

  res.status(200).json(user);
};

module.exports = {
	check_api_key: check_api_key,
	create_charge: create_charge,
	get_user: get_user,
	create_user: create_user,
	update_user: update_user,
	delete_user: delete_user,
	get_restroom: get_restroom,
	create_restroom: create_restroom,
	update_restroom: update_restroom,
	delete_restroom: delete_restroom,
	get_area_restrooms: get_area_restrooms,
	upsert_fb_user: upsert_fb_user,
	create_token: create_token,
	generate_token: generate_token,
	send_token: send_token,
	check_auth: check_auth,
	authenticate: authenticate,
	get_current_user: get_current_user,
	get_one: get_one
};