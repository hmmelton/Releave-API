"use strict";
module.exports = function(app) {
	var controller = require('../controllers/releaveController');

	app.all('*', controller.check_api_key);

	// Login route
	app.route('/login')
		.post(controller.login);
/*
	// User routes
	app.route('/users')
		.get(controller.get_user)
		.post(controller.create_user)
		.delete(controller.delete_user);

	// Restroom routes
	app.route('/restrooms')
		.get(controller.get_restroom)
		.post(controller.create_restroom)
		.delete(controller.delete_restroom);*/
};