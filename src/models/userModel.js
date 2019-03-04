'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	created_when: {
		type: String,
		default: Date.now
	},
	first_name: {
		type: String
	},
	last_name: {
		type: String,
		default: null
	},
	email: {
		type: String
	},
	facebook_id: {
		type: String
	},
	paid: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Users', UserSchema);
