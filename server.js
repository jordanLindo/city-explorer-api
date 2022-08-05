/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';
console.log('server.js connected.');



// REQUIRE
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
//let data = require('./data/weather.json');


// USE
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
    response.status(200).send('Active');
});


app.get('/weather', async (request, response, next) => {
    try {
        let lat = request.query.lat;
        let lon = request.query.lon;
        let cityUrl = `${process.env.WEATHER_API_URL}`;
        let isQueried = false;
        if (lat !== undefined && lon !== undefined) {
            cityUrl += `lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
            isQueried = true;
        }
        if (isQueried) {
            let aCity;
            let results = await axios.get(cityUrl);
            aCity = results.data;
            if (aCity !== undefined) {
                let cityInstance = new City(aCity.data[0]);

                let forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityInstance.cityName}&key=${process.env.WEATHER_API_KEY}&units=I`;

                let forecastResult = await axios.get(forecastUrl);

                cityInstance.forecast = forecastResult.data;

                let dataToSend = cityInstance.forecast;
                response.status(200).send(dataToSend);
            };


        } else {
            throw new Error('City not found in weather.');
        }
    } catch (error) {
        next(error);
    }
});

app.get('/movie', async (request, response, next) =>{
    try{
        let movieUrl = `${process.env.MOVIE_API_URL}api_key=${process.env.MOVIE_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_keywords=${request.query.keyword}&with_watch_monetization_types=free`;

        let movieResult = await axios.get(movieUrl);

        response.status(200).send(movieResult);


    }catch(error){
        next(error);
    }
})

//catch-all
app.get('*', (request, response) => {
    response.status(404).send('The route was not found. Error 404');
});

//Classes
class City {
    constructor(cityObject) {
        this.cityName = cityObject.city_name;
        this.lon = cityObject.lon;
        this.lat = cityObject.lat;
        this.forecast = [];
    }
}

//Errors
app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
