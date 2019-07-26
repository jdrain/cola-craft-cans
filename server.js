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

/**
 * Utils -- Move this to a separate file
 */
var isDataValidForBeerQuery = (data) => {
    return (data.states && Array.isArray(data.states)) || 
        (data.abvLevels && Array.isArray(data.abvLevels)) || 
        (data.breweries && Array.isArray(data.breweries));
}

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
    database.getAllBreweries((res) => {
        response.json(res);
    })
})

/**
 * 
 */
router.post("/getBreweriesByState/", (request, response) => {
    var data = request.body;
    if (!data.statesToCheck || !Array.isArray(data.statesToCheck)){
        response.json({"Error": "An array of state abbreviations must be passed"});
    } else {
        database.getBreweriesByState(data.statesToCheck, (res) => {
            response.json(res);
        })
    }
})

/**
 * 
 */
router.post("/getBeers/", (request, response) => {
    var data = request.body;
    if (!isDataValidForBeerQuery(data)) {
        response.json({"Error": "An array of at least one of the following must be passed: states, abvLevels, breweries."});
    } else {
        database.getBeersBasedOnParams(data.abvLevels, data.states, data.breweries, (res) => {
            response.json(res);
        });
    }
})

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// all endpoints are prepended with '/api'
app.use('/api', router);

// Start the server instance
app.listen(port);