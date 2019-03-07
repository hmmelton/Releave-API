'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RestroomSchema = new Schema({
	created_when: {
		type: Date,
		required: true,
		default: Date.now
	},
	created_by: {
		type: String,
		required: true,
		default: null
	},
	updated_when: {
		type: Date,
		required: true,
		default: Date.now
	},
	updated_by: {
		type: String,
		default: null
	},
	lat: {
		type: Number,
		required: true
	},
	lng: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true
	},
	is_locked: {
		type: Boolean,
		required: true,
		default: true
	},
	is_single_occupancy: {
		type: Boolean,
		default: false
	},
	rating: {
		type: Number,
		required: true,
		default: 0
	},
	num_ratings: {
		type: Number,
		required: true,
		default: 0
	}
});
RestroomSchema.pre('save', function (next) {
	this.updated_by = this.get("created_by");
	next();
});
RestroomSchema.pre('findOneAndUpdate', function (next) {
	let doc = this.getUpdate();
	doc.updated_when = Date.now();
	next();
});

module.exports = mongoose.model('Restrooms', RestroomSchema);
