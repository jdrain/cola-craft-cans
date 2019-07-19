/**
 * Module to drive database communication with the PostgreSQL db
 * 
 * Configure environment variables for the connection info: https://node-postgres.com/features/connecting
 * 
 * TODO:
 *  + Method to get filtered list of breweries
 *  + Method to get beers based on abv, state, and breweries
 *  + Method to initialize the session so that the consuming code can choose when to end the pool
 *  + Separate file to hold string formatting things.
 * 
 */

const { Pool, Client } = require("pg");
const sprintf = require("sprintf-js").sprintf;

// put this in a separate string formatting file
const queryStrings = {
    "getBreweriesByStateQueryString": "SELECT brewery_id,name,city,state FROM breweries WHERE state IN (%s);",
    "getBeersQueryString": "<getBeersQueryString>"
}

module.exports = {

    // stores the active database pool object
    activeDatabasePool : null,

    /**
     * Initialize a database pool
     */
    initializeDatabasePool: function() {
        if (!this.activeDatabasePool) {
            this.activeDatabasePool = new Pool();
        }
    },

    /**
     * Close the active pool
     */
    closeActivePool: function() {
        if (this.activeDatabasePool) {
            this.activeDatabasePool.end();
            this.activeDatabasePool = null;
        }
    },

    /**
     * Get the querystring for breweries by state
     * 
     * @param: {Array} states: contains state abbreviation strings
     * @returns: {string} querystring: the full querystring
     */
    getBreweriesByStateQueryString: function(states) {
        var queryStringBase = queryStrings.getBreweriesByStateQueryString;
        var stateString = `\'${states[0]}\'`;
        for (var i = 1; i < states.length; i++) {
            stateString += `,\'${states[i]}\'`;
        }
        return sprintf(queryStringBase,stateString);
    },

    /**
     * Get all the breweries that exist in given states.
     * 
     * @param {list} states: Collection of State strings.
     * @param {function} callback: Do something with the result of the query.
     *  
     */
    getBreweriesByState: function(states, callback) {
        
        if (!this.activeDatabasePool) {
            callback({"err": "No database pool initialized. Please call initializeDatabasePool()."});
            return;
        }

        var statesQueryString = this.getBreweriesByStateQueryString(states);
        console.log(statesQueryString);
        this.activeDatabasePool.query(statesQueryString, (err, res) => {
                if (err) {
                    callback(err);
                }
                else {
                    callback(res);
                }
            }
        );
    },

    /**
     * Get a list of beers based on given params.
     * 
     * @param {list} selectedIbuLevels: Collection of IBU level strings.
     * @param {list} selectedStates: Collection of State strings. This won't be necessary if we're filtering breweries based on this at the UI level
     * @param {list} selectedBreweries: Collection of brewery ids.
     * @param {function} callback: Do something with the result of the query 
     */
    getBeersBasedOnParameters: function(callback) {

    }
}