'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	created_when: {
		type: String,
		default: Date.now
	},
	facebook_id: {
		type: String
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
	}
});

module.exports = mongoose.model('Users', UserSchema);
