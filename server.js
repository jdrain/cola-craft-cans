/**
 * Define endpoints that the front end will need
 * 
 * TODO:
 *  + Create a separate file that holds the standard error strings
 * 
 */

"use strict";

var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var search = require("./search_data.js");
var database = require("./database.js");

var port = 8080;
var app = express();
var router = express.Router();


// allow localhost origin
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * 
 */
router.get("/getAllBreweries/", (request, response) => {
    //response.header("Access-Control-Allow-Origin", "*");
    //response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    database.getAllBreweries((res) => {
        response.json(res);
    })
})

/**
 * 
 */
router.post("/getBreweriesByState/", (request, response) => {
    var data = request.body;
    console.log(JSON.stringify(request.body));
    if (!data.statesToCheck || !Array.isArray(data.statesToCheck)){
        response.json({"Error": "An array of state abbreviations must be passed"});
    } else {
        database.getBreweriesByState(data.statesToCheck, (res) => {
            response.json(res);
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