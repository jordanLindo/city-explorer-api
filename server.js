/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

console.log('server.js connected.');



// REQUIRE
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json');
const cors = require('cors');
const axios = require('axios');


// USE
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
    response.status(200).send('Active');
});


app.get('/weather', (request, response, next) => {
    try {
        let searchQuery = request.query.searchQuery;
        let lat = request.query.lat;
        let lon = request.query.lon;
        let cityUrl = `${process.env.WEATHER_API_URL}/weather/?key=${process.env.WEATHER_API_KEY}`;
        let isQueried = false;
        if (searchQuery !== undefined) {
            cityUrl += `&searchQuery=${searchQuery}`;
            isQueried = true;
        }
        if (lat !== undefined && lon !== undefined) {
            cityUrl += `&lat=${lat}&lon${lon}&format=json`;
            isQueried = true;
        }
        if (isQueried) {
            let aCity;
            axios({
                method: 'get',
                url: cityUrl
            }).then(apiResponse => {
                aCity = apiResponse.data;
            }); if (aCity !== undefined) {
                let cityInstance = new City(aCity);
                let dataToSend = cityInstance.data.map((val) => {
                    return (new Forecast(val.valid_date, 'Low of ' + val.high_temp + ', high of ' + val.low_temp + ' with ' + val.weather.description));
                });
            } else {
                throw new Error('City not found in weather.');
            }
            response.status(200).send(dataToSend);
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
        this.data = cityObject.data;
        this.city_name = cityObject.city_name;
        this.lon = cityObject.lon;
        this.lat = cityObject.lat;
        this.timezone = cityObject.timezone;
        this.country_code = cityObject.country_code;
        this.state_code = cityObject.state_code;
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
