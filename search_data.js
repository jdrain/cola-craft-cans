/**
 * node search_data.js <name>
 *
 */

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var query = process.argv[2];
var fs = require("fs");

// Connection URL
var url = 'mongodb://localhost:27017';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
     assert.equal(null, err);
     console.log("Connected successfully to server");
  
     var dbobj = db.db("beerdata");
     var beers = dbobj.collection("beers");
     beers.find({
	     name: query
         })
	 .toArray()
         .then( (res, err) => {
	      assert.equal(null, err);
              console.log(res[0]);
	      var data = res[0];
	      var obj = {
		  "abv_level": data.abv_level,
		  "brewery_names": data.brewery_names,
		  "ibu_level": data.ibu_level,
		  "states": data.states
	      }
	      console.log(obj)
              db.close(); 
         });
});
