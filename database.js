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
    "getAllBreweries": "SELECT brewery_id,name,city,state FROM breweries;",
    "getBeersBaseQueryString": `
    SELECT beers.name as beer_name, beer_id, style, abv_level, breweries.name as brewery_name, city, state
    FROM beers JOIN breweries
    ON beers.brewery_id = breweries.brewery_id
    WHERE`,
    "statesFilter": "\nstate IN (%s)",
    "abvLevelFilter": "\nabv_level IN (%s)",
    "breweriesFilter": "\nbreweries.brewery_id IN (%s)"
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
     * Get a comma delimited string from an array of strings.
     * Each individual string will be enclosed in single quotes
     * so that it can be used in SQL queries.
     * 
     * @param {Array} strings: an array of strings
     * @returns {string} delimitedString: a comma delimited string 
     */
    getCommaDelimitedString: (strings) => {
        if (!strings.length > 0) return '';
        var delimitedString = `\'${strings[0]}\'`;
        for (var i = 1; i < strings.length; i++) {
            delimitedString += `,\'${strings[i]}\'`;
        }
        return delimitedString;
    },

    /**
     * Get a substring to filter by some criteria. Used in a SQL where clause.
     * 
     * @param {string} baseString: The SQL query substring
     * @param {string} filterString: A comma delimited string of values to filter by
     */
    getSqlFilterString: (baseString, filterString) => {
        return sprintf(baseString, filterString);
    },

    /**
     * Get the querystring for breweries by state
     * 
     * @param: {Array} states: contains state abbreviation strings
     * @returns: {string} querystring: the full querystring
     */
    getBreweriesByStateQueryString: function(states) {
        var queryStringBase = queryStrings.getBreweriesByStateQueryString;
        var stateString = this.getCommaDelimitedString(states);
        return sprintf(queryStringBase,stateString);
    },

    /**
     * Get the querystring for beers based on the following params 
     * 
     * @param {array} abvLevels: Collection of IBU level strings.
     * @param {array} states: Collection of states
     * @param {array} selectedBreweries: Collection of brewery ids.
     */
    getBeersBasedOnParamsQueryString: function(abvLevels, states, breweries) {
        var shouldAddAnd = false;
        var queryString = queryStrings.getBeersBaseQueryString;
        
        if (abvLevels && abvLevels.length != 0) {
            var abvLevelFilterString = 
                this.getSqlFilterString(queryStrings.abvLevelFilter, this.getCommaDelimitedString(abvLevels));
            queryString = `${queryString}\n${abvLevelFilterString}`;
            shouldAddAnd = true;
        }

        // If we have breweries, then the state info is redundant
        if (breweries && breweries.length != 0) {
            var breweriesFilterString = 
                this.getSqlFilterString(queryStrings.breweriesFilter, this.getCommaDelimitedString(breweries));
            queryString = shouldAddAnd ? `${queryString} AND` : queryString;
            queryString = `${queryString}${breweriesFilterString}`;
        } else if (states && states.length != 0) {
            var statesFilterString =
                this.getSqlFilterString(queryStrings.statesFilter, this.getCommaDelimitedString(states));
            queryString = shouldAddAnd ? `${queryString} AND` : queryString;
            queryString = `${queryString}${statesFilterString}`
        }
        return queryString;
    },

    /**
     * Get all the breweries that exist in given states.
     * 
     * @param {list} states: Collection of State strings.
     * @param {function} callback: Do something with the result of the query.
     */
    getBreweriesByState: function(states, callback) {
        this.initializeDatabasePool();
        this.activeDatabasePool.query(
            this.getBreweriesByStateQueryString(states), (err, res) => {
                if (err) {
                    callback(err);
                }
                else if (res.rows) {
                    callback(res.rows);
                }
            }
        );
    },

    /**
     * Get all the breweries we have in the database
     * 
     * @param {function} callback: Do something with the result of the query
     */
    getAllBreweries: function(callback) {
        this.initializeDatabasePool();
        this.activeDatabasePool.query(queryStrings.getAllBreweries, (err, res) => {
            if (err) {
                callback(err);
            } else if (res.rows) {
                callback(res.rows);
            }
        })
    },

    /**
     * Get a list of beers based on given params.
     * 
     * @param {array} abvLevels: Collection of IBU level strings.
     * @param {array} states: Collection of states
     * @param {array} selectedBreweries: Collection of brewery ids.
     * @param {function} callback: Do something with the result of the query
     */
    getBeersBasedOnParams: function(abvLevels, states, breweries, callback) {
        this.initializeDatabasePool();
        this.activeDatabasePool.query(
            this.getBeersBasedOnParamsQueryString(abvLevels, states, breweries), (err, res) => {
                if (err) {
                    callback(err);
                } else if (res.rows) {
                    callback(res.rows);
                }
            }
        );
    }
}