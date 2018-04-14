/**
 * node search_data.js <name>
 *
 */

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var query = process.argv[2];
var fs = require("fs");

function compare(a, b) {
	// Use toUpperCase() to ignore character casing
	const wa = a.weight;   
	const wb = b.weight;
		let comparison = 0;
		if (wa > wb) {
			comparison = 1;
		} else if (wa < wb) {
			comparison = -1;
		}
			return comparison               
}

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
		console.log(obj);
		return { db, obj };
	})
	.then( (dummy) => {
		var db = dummy.db;
		var obj = dummy.obj;
		var q_obj = {
			$or: [
			{ "abv_level": obj.abv_level },
			{ "brewery_names": obj.brewery_names },
			{ "ibu_level": obj.ibu_level },
			{ "states": obj.states }
		]
		}
		var dbobj = db.db("beerdata");
		beers.find(q_obj).toArray()
		.then( (res, err) => { 
			assert.equal(err, null);
			console.log(res);
			var arr = new Array();
			res.forEach((r) => {
				var beerobj = r;
				var weight = 0;
				if (beerobj.abv_level == obj.abv_level) {
					weight++;
				}
				if (beerobj.brewery_names == obj.brewery_names) {
					weight++;
				}
				if (beerobj.ibu_level == obj.ibu_level) {
					weight++;
				}
					if (beerobj.states == obj.states) {
					weight++;
				}
				arr.push({
					doc: beerobj,
					weight: weight
				});
			})
			arr.sort(compare);
			console.log(arr.slice(1).slice(-10).reverse());
			return db
		})
		.then( (db) => {
			db.close();
		})
	})
});


