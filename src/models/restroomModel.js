'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RestroomSchema = new Schema({
	created_when: {
		type: Date,
		default: Date.now
	},
	created_by: {
		type: String,
		default: null
	},
	udpated_when: {
		type: Date,
		default: Date.now
	},
	updated_by: {
		type: String,
		default: null
	},
	lat: {
		type: Number,
		default: null
	},
	lng: {
		type: Number,
		default: null
	},
	name: {
		type: String,
		default: null
	},
	location: {
		type: String,
		default: null
	},
	is_locked: {
		type: Boolean,
		default: true
	},
	is_single_occupancy: {
		type: Boolean,
		default: false
	},
	rating: {
		type: Number,
		default: 0
	},
	num_ratings: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Restrooms', RestroomSchema);
