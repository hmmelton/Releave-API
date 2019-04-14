'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	created_when: {
		type: Number,
		required: true,
		default: Date.now
	},
	updated_when: {
		type: Number,
		required: true,
		default: Date.now
	},
	first_name: {
		type: String,
		required: true,
		default: null
	},
	last_name: {
		type: String,
		default: null
	},
	email: {
		type: String,
		required: true,
	},
	facebook_id: {
		type: String,
		required: true,
	},
	paid: {
		type: Boolean,
		required: true,
		default: false
	}
});
UserSchema.pre('findOneAndUpdate', function (next) {
	let doc = this.getUpdate();
	doc.updated_when = Date.now();
	next();
});

module.exports = mongoose.model('Users', UserSchema);
