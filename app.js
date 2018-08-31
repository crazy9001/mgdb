// 1. Include Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// 2. Include Configuration
var config = require('./config');

// 3. Initialize the application
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 4. Force https in production
if (app.get('env') === 'production') {
    app.use(function(req, res, next) {
        var protocol = req.get('x-forwarded-proto');
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}

// 5. Connect to MongoDB

mongoose.connect(config.MONGO_URI);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// 6. Load app routes
const product = require('./routes/product.route'); // Imports routes for the products
app.use('/products', product);

// 7. Start the server
app.listen(config.LISTEN_PORT, function(){
    console.log('listening on port ' + config.LISTEN_PORT);
});
