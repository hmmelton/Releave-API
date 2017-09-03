"use strict";
var mongoose = require('mongoose'),
	User = mongoose.model('Users'),
	Restroom = mongoose.model('Restroom'),
	Private = require('../../private_strings');

exports.login = function(req, res) {
	if (req.query.api_key !== Private.API_KEY) {
		// API was not sent, or an invalid one was sent
		res.status(401).json({ error: 'Unauthorized access. Request must contain api_key parameter' });
	}
};