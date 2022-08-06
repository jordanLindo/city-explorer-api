'use strict';

let cache = require('./cache.js');
let axios = require('axios');

module.exports = getWeather;

async function getWeather(latitude, longitude) {
    const key = 'weather-' + latitude + longitude;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=I`;

    if (cache[key] && (Date.now() - cache[key].timestamp < (1000 * 60 * 60 * 24))) {
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