'use strict';
let cache = require('./cache.js');
let axios = require('axios');

module.exports = getMovie;

async function getMovie(keyword){
    const key = 'movie-'+keyword;
    const url = `${process.env.MOVIE_API_URL}api_key=${process.env.MOVIE_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_keywords=${keyword}&with_watch_monetization_types=free`;

    if(cache[key] && (Date.now() - cache[key].timestamp < (60 * 60 * 24 * 3650000))){
        console.log('Cache hit');
    } else {
        console.log('Cache miss');
        cache[key] = {};
        cache[key].timestamp = Date.now();
        let result = await axios.get(url);
        let dataToSend = result.data;
        cache[key].data = dataToSend;
    }
    return cache[key].data;
}