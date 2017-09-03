var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	User = require('./api/models/userModel'), // User model loading
	Restroom = require('./api/models/restroomModel'), // Restroom model loading
	Strings = require('./private_strings'),
	bodyParser = require('body-parser');

// Mongoose instance connection URL
mongoose.Promise = global.Promise;
console.log(Strings.MONGO_DB);
mongoose.connect('mongodb://' + Strings.MONGO_DB, {
	useMongoClient: true
});

app.use(bodyParser.urlencoded({ extended: true })); // Body parser for URL-encoded forms
app.use(bodyParser.json()); // Body parser for JSON

var routes = require('./api/routes/releaveRoutes'); // Importing API routes
routes(app); // Register the routes

app.listen(port);

console.log('Releave RESTful API server started on port: ' + port);