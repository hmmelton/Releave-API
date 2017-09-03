'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	created_date: {
		type: Date,
		default: Date.now
	},
	facebook_id: {
		type: String,
		default: null
	},
	first_name: {
		type: String,
		default: null
	},
	last_name: {
		type: String,
		default: null
	},
	paid: {
		type: Boolean,
		default: false
	},
	paid_exp: {
		type: Number,
		default: 0
	},
	stripe_token: {
		type: String,
		default: null
	}
});

module.exports = mongoose.model('Users', UserSchema);