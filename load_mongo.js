/**
 *
 */

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var query = process.argv[2];
var fs = require("fs");

var rawjson = JSON.parse(fs.readFileSync("./convertcsv.json"));
rawjson.forEach( (item) => {
	console.log(item)
});

// Connection URL
var url = 'mongodb://localhost:27017';
  // Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
     assert.equal(null, err);
     console.log("Connected successfully to server");
  
     var dbobj = db.db("beerdata");
     var beers = dbobj.collection("beers");
     beers.insertMany(rawjson).then( (res, err) => {
         assert.equal(null, err);
	 console.log(JSON.stringify(res, null, 2));
	 db.close(); 
     });
});
