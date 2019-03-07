"use strict";
var mongoose = require('mongoose'),
	User = mongoose.model('Users'),
	Restroom = mongoose.model('Restrooms'),
	strings = require('../private_strings'),
	expressJwt = require('express-jwt'),
	https = require('https'),
	jwt = require('jsonwebtoken');

/*
 * USER FUNCTIONS
 */

// This function fetches a user
var get_user = function(req, res) {
	// Find user with matching ID
	User.findById(req.params.id, function(err, user) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send("{}");
		} else if (user === null) {
			// If user is null, send back error to client
			res.status(404).send("{}");
		} else {
			// User was found - return to client
			delete user['__v'];
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
			res.status(500).send("{}");
		} else {
			// User was created - return to client
			delete user['__v'];
			res.status(201).json(user);
		}
	});
};

// This function updates a user
var update_user = function(req, res) {
	User.findOneAndUpdate({_id: req.params.id }, req.body, { new: true }, function(err, user) {
		if (err) {
			// If there was an error, send it back to the client
			res.status(500).send("{}");
		} else if (user === null) {
			// If user is null, send back error to client
			res.status(404).json("{}");
		} else {
			// User was updated - return to client
			delete user['__v'];
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
			res.status(500).send("{}");
		} else if (user === null) {
			// If user is null, send back error to client
			res.status(404).json("{}");
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
			res.status(500).send("{}");
		} else if (restroom === null) {
			// If restroom is null, send back error to client
			res.status(404).json("{}");
		} else {
			// Restroom was found - return to client
			delete restroom['__v'];
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
			delete restroom['__v'];
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
		} else if (restroom === null) {
			// If restroom is null, send back error to client
			res.status(404).json("{}");
		} else {
			// Restroom was updated - return to client
			delete restroom['__v'];
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
			res.status(500).send("{}");
		} else if (restroom === null) {
			// If restroom is null, send back error to client
			res.status(404).json("{}");
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
		res.status(401).json("{}");
	} else {
		// Find restrooms in the given latitude and longitude ranges
		Restroom.find({
			lat: { $gt: req.query.min_lat, $lt: req.query.max_lat },
			lng: { $gt: req.query.min_lng, $lt: req.query.max_lng }
		}, function(err, restrooms) {
			if (err) {
				// If there was an error, return it to the user
				res.status(500).send("{}");
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

// This function verifies an authorization token passed to each request as a header.
var authenticate = expressJwt({
	secret: strings.TOKEN_GEN_SECRET,
	requestProperty: 'auth',
	get_token: function(req) {
		if (req.get('Authorization')) {
			// Token is valid
			return req.get("Authorization");
		}
		// Token is not valid
		return null;
	}
}).unless({ path: [/^\/api\/v1\/auth\/facebook/] }); // Login endpoint is only that does not not require an auth token

// If there was an error with the auth token, send it back to the client.
var handle_auth_error = function(err, req, res, next) {
	if(err.name === 'UnauthorizedError') {
		res.status(401).send({ error: err.message });
	 	return;
	}
	next();
}

var create_token = function(auth) {
  return jwt.sign({
    id: auth.id
  }, strings.TOKEN_GEN_SECRET,
  {
    expiresIn: 60 * 60 * 24  // 1 day expiration
  });
};

var generate_token = function (req, res, next) {
  req.token = create_token(req.auth);
  next();
};

var send_token = function (req, res) {
  res.setHeader('Authorization', req.token);
  res.status(req.status).send(req.user);
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

var check_facebook_token = function(req, res, next) {
	let facebook_id = req.body.facebook_id;
	let facebook_token = req.get('FacebookAuth')

	if (facebook_id == null) {
		return res.status(400).json({"error": "facebook_id not provided in body"})
	}
	if (facebook_token == null) {
		return res.status(400).json({"error": "FacebookAuth header not provided"})
	}

	// Verify that Facebook token came from Releave
	https.get(`https://graph.facebook.com/debug_token?input_token=${facebook_token}&access_token=${strings.FACEBOOK_APP_ACCESS_TOKEN}`, (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			console.log(JSON.parse(data));
			let validToken = JSON.parse(data).data.is_valid;

			if (validToken) {
				return next();
			} else {
				return res.status(403).send({"error": "Facebook token invalid"});
			}
		});
	}).on('error', (err) => {
		return next(err);
	});
}

// This function returns a user, creating a new one if necessary
var upsert_fb_user = function(req, res, next) {
	// Find user with matching facbook_id
	return User.findOne({
		'facebook_id': req.body.facebook_id
	}, function(err, user) {
		if (!user) {
			// If user is null, create new one
			req.body.created_when = Date.now()
			var newUser = new User(req.body);

			// Save new user
			newUser.save(function(error, savedUser) {
				if (error) {
					// Handle error
					console.log(error);
					return res.send(err);
				}

				req.user = savedUser;
				req.status = 201

				return next();
			});
		} else if (!err) {

			// If user was found, return data
			req.user = user;
			req.status = 200

			// Move on
			return next();
		}
	});
};

var get_current_user = function(req, res, next) {
  User.findById(req.auth.id, function(err, user) {
    if (err) {
      	next(err);
    } else {
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
	get_user: get_user,
	create_user: create_user,
	update_user: update_user,
	delete_user: delete_user,
	get_restroom: get_restroom,
	create_restroom: create_restroom,
	update_restroom: update_restroom,
	delete_restroom: delete_restroom,
	get_area_restrooms: get_area_restrooms,
	authenticate: authenticate,
	handle_auth_error: handle_auth_error,
	upsert_fb_user: upsert_fb_user,
	create_token: create_token,
	generate_token: generate_token,
	send_token: send_token,
	check_auth: check_auth,
	check_facebook_token: check_facebook_token,
	get_current_user: get_current_user,
	get_one: get_one
};
