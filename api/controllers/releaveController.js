"use strict";
var mongoose = require('mongoose'),
	User = mongoose.model('Users'),
	Restroom = mongoose.model('Restrooms'),
	Strings = require('../../private_strings');

// This function ensures the client making a request has authorized access
var check_api_key = function(req, res, next) {
	if (!req.query.api_key) {
		// API key was not sent
		res.status(401).json({ error: 'Unauthorized access. Query parameter api_key must be provided' });
	} else if (req.query.api_key !== Strings.API_KEY) {
		// Invalid API key sent
		res.status(401).json({ error: 'Unauthorized access. Query parameter api_key does not match server API key' });
	} else {
		// Client is authorized, move on to specific request
		next();
	}
};

// This function logs in a user
var login = function(req, res) {
	// Make sure fb_id parameter has been passed
	if (!req.query.fb_id) res.status(401).json({ error: 'Query parameter fb_id is required.' });

	// Find user with matching facbook_id
	User.findOne({ 'facebook_id': req.query.fb_id }, function(err, user) {
		// Handle error
		if (err) res.status(500).send(err);

		// If user is null, create new one
		if (user === null) {
			create_user(req, res);
			return;
		}

		// If user was found, return data
		res.status(200).json(user);
	});
};

// This function creates a user
var create_user = function(req, res) {
	// If user is null, create a new user
	var new_user = new User(req.body);
	console.log(req.body);
	console.log(new_user);
	new_user.save(function(err, user) {
		// Handle error
		if (err) res.status(500).send(err);

		res.status(201).json(user);
	});
};

module.exports = {
	check_api_key: check_api_key,
	login: login,
	create_user: create_user
};