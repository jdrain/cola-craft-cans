/**
 *
 */

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017';
  // Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
     assert.equal(null, err);
     console.log("Connected successfully to server");
  
     var dbobj = db.db("beerdata");
     var beers = dbobj.collection("beers");
     beers.find({}).toArray( (err, res) => {
	  assert.equal(null, err);
	  console.log(JSON.stringify(res, null, 2));
     });
     db.close();
});
