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
            console.log(aCity);
            console.log(aCity.data[0].weather.description);
            if (aCity !== undefined) {
                let cityInstance = new City(aCity.data[0]);

                let forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityInstance.cityName}&key=${process.env.WEATHER_API_KEY}&units=I`;

                let forecastResult = await axios.get(forecastUrl);

                cityInstance.forecast = forecastResult.data;

                let dataToSend = cityInstance.forecast;
                console.log(dataToSend)
                response.status(200).send(dataToSend);
            };


        } else {
            throw new Error('City not found in weather.');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

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

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

//Errors
app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
