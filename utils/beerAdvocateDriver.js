var beeradvocate = require("beeradvocate-api");
var http = require("http");

var beerAdvocateDriver = {};


beerAdvocateDriver.searchBeer = function(search) {

    beeradvocate.beerSearch(search, function(beer) {
        console.log(beer);
    });
};

module.exports = beerAdvocateDriver;