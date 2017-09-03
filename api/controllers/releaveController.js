"use strict";
var mongoose = require('mongoose'),
	User = mongoose.model('Users'),
	Restroom = mongoose.model('Restrooms'),
	private = require('../../private_strings');

// This function ensures the client making a request has authorized access
exports.check_api_key = function(req, res) {
	if (!req.query.api_key) {
		// API key was not sent
		res.status(401).json({ error: 'Unauthorized access. Query parameter api_key must be provided' });
	} else if (req.query.api_key !== Private.API_KEY) {
		// Invalid API key sent
		res.status(401).json({ error: 'Unauthorized access. Query parameter api_key does not match server API key, ' + private.API_KEY + ", " + private});
	}
};

exports.login = function(req, res) {
	 res.status(200).json({ message: 'logged in' });
};