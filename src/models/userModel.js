'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	created_when: {
		type: String,
		default: Date.now
	},
	updated_when: {
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
UserSchema.pre('findOneAndUpdate', function (next) {
	let doc = this.getUpdate();
	doc.updated_when = Date.now();
	next();
});

module.exports = mongoose.model('Users', UserSchema);
