var user_likes = {
    "abv" : 0,
    "ibu" : 0,
    "states" : [],
    "brewery_names" : [],
    "number_beers" : 0
};

function user_like(beers) {
    for (var i = 0; i < beers.size; i++) {
        user_likes.number_beers++;
        
        user_likes.abv += beers[i].abv;
        user_likes.ibu += beers[i].ibu;
        user_likes.states.append(beers[i].state);
        user_likes.brewery_names.append(beers[i].brewery_name)
    }

    // abv
    user_likes.abv = user_likes.abv / user_likes.number_beers;

    // ibu
    user_likes.ibu = user_likes.ibu / user_likes.number_beers;

    var beer_query = {
        "abv": Math.round(user_likes.abv),
        "ibu": Math.round(user_likes.ibu),
        "states": user_likes.states,
        "brewery_name": user_likes.brewery_names
    };

    return beer_query;
}

function recommendation() {
    
}