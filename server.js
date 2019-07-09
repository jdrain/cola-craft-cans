"use strict";

var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var search = require("./search_data.js");

var port = 8080;
var app = express();
var router = express.Router();

router.post("/query/", function (request, response) {
    var data = request.body;
    
    if (!data.queryString) {
        response.json({"Error": "A querystring must be passed"});
    } else {
        search.queryDatabase(data.queryString, (beersToReturn) => {
            response.json({"Result": beersToReturn});
        })
    }
})

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// all endpoints are prepended with '/api'
app.use('/api', router);

// Start the server instance
app.listen(port);