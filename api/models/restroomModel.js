'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RestroomSchema = new Schema({
	created_date: {
		type: Date,
		default: Date.now
	},
	user_id: {
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
	free: {
		type: Boolean,
		default: true
	},
	verified: {
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
	},
	rating_comment: {
		type: String,
		default: null
	}
});

module.exports = mongoose.model('Restrooms', RestroomSchema);