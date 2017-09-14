'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	created_date: {
		type: Date,
		default: Date.now
	},
	facebook_provider: {
		type: {
			id: String,
			token: String
		},
	},
	first_name: {
		type: String,
	},
	last_name: {
		type: String,
		default: null
	},
	email: {
		type: String,
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