"use strict";
var mongoose = require('mongoose'),
	User = mongoose.model('Users'),
	Restroom = mongoose.model('Restrooms'),
	Strings = require('../../private_strings');

// This function ensures the client making a request has authorized access
exports.check_api_key = function(req, res, next) {
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
exports.login = function(req, res) {
	// Make sure fb_id parameter has been passed
	if (!req.query.fb_id) {
		res.status(401).json({ error: 'Query parameter fb_id is required.' });
		return;
	}
	// Find user with matching facbook_id
	User.findOne({ 'facebook_id': req.query.fb_id }, function(err, user) {
		// There was an error
		if (err) res.status(404).send(err);

		if (user === null) res.status(404).json({ error: 'User not found' });
		
		res.status(200).json(user);
	});
};