"use strict";
module.exports = function(app) {
	var controller = require('../controllers/releaveController'),
	strings = require('../private_strings'),
	express_jwt = require('express-jwt');

	// Global routes
	// Check authorization for each endpoint
	app.use('/api/v1', controller.authenticate, controller.handle_auth_error);

	// Authenticate route
	app.route('/api/v1/auth/facebook')
		.post(controller.upsert_fb_user,
			controller.check_auth,
			controller.generate_token,
			controller.send_token);

	// Get current user route
	app.route('/api/v1/auth/me')
		.get(controller.get_current_user, controller.get_one);

	// User routes
	app.route('/api/v1/users/:id')
		.get(controller.get_user)
		.put(controller.update_user)
		.delete(controller.delete_user);

	app.route('/api/v1/users')
		.post(controller.create_user);

	// Restroom routes
	app.route('/api/v1/restrooms/:id')
		.get(controller.get_restroom)
		.put(controller.update_restroom)
		.delete(controller.delete_restroom);

	app.route('/api/v1/restrooms')
		.post(controller.create_restroom);

	app.route('/api/v1/area_restrooms')
		.get(controller.get_area_restrooms);
};
