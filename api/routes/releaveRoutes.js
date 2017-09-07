"use strict";
module.exports = function(app) {
	var controller = require('../controllers/releaveController');

	// Global routes
	app.route('*')
		.all(controller.check_api_key);

	/*app.route('*')
		.get(function(req, res, next) {
			if (req.path !== '/area_restrooms') {
				// Check for id query param unless the above path is the one used
				controller.check_for_id(req, res, next);
			} else {
				// If '/area_restrooms' is the request path, move on
				next();
			}
		})
		.put(controller.check_for_id)
		.delete(controller.check_for_id);*/

	// Login route
	app.route('/login/:fb_id')
		.post(controller.login);

	// Stripe route
	app.route('/charge')
		.post(controller.create_charge);

	// User routes
	app.route('/users/:id')
		.get(controller.get_user)
		.put(controller.update_user)
		.delete(controller.delete_user);

	app.route('/users')
		.post(controller.create_user);

	// Restroom routes
	app.route('/restrooms/:id')
		.get(controller.get_restroom)
		.put(controller.update_restroom)
		.delete(controller.delete_restroom);

	app.route('/restrooms')
		.post(controller.create_restroom);

	app.route('/area_restrooms')
		.get(controller.get_area_restrooms);
};