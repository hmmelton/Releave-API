'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    User = require('./models/userModel'),
    // User model loading
    Restroom = require('./models/restroomModel'),
    // Restroom model loading
    strings = require('./private_strings'),
    // File holding secret strings
    bodyParser = require('body-parser');

// Mongoose instance connection URL
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + strings.MONGO_DB, {
	useMongoClient: true
});

app.use(bodyParser.urlencoded({ extended: true })); // Body parser for URL-encoded forms
app.use(bodyParser.json()); // Body parser for JSON

var routes = require('./routes/releaveRoutes'); // Importing API routes
routes(app); // Register the routes

app.listen(port);
//# sourceMappingURL=server.js.map
