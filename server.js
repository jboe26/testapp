
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// show all models
var db = require("../models");

var PORT = process.env.PORT || 8000;

// Initialize Express
var app = express();

// set up router
var router = express.Router();

// routes
require("../routes/htmlRoutes.js")(router);
require("../routes/scrape-apiRoutes.js")(router);
require("../routes/comment-apiRoutes.js")(router);


// Configure middleware

// use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// set handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// get database - heroku or localhost
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsarticles";

// connect to mongo db
mongoose.connect(MONGODB_URI , { useNewUrlParser: true }, function(error) {
    if (error) {
        console.log(error)
    } else {
        console.log("mongoose successfully connected")
    };
});

mongoose.set('useCreateIndex', true);

// use router
app.use(router);


// Simple index route
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "./public/index.html"));
  });

// Start the server
app.listen(PORT, function() {
  console.log("App listening on port " + PORT);
});