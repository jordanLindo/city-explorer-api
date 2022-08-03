/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

const { request } = require('express');

console.log('server.js connected.');



// REQUIRE
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json');
const cors = require('cors');
const { response } = require('express');


// USE
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
    response.send('Active');
});

app.get('/weather', (request, response, next) => {
    try {
        let searchQuery = request.query.searchQuery;
        let lat = request.query.lat;
        let lon = request.query.lon;
        let aCity = data.find(city => city.city_name === searchQuery || city.lat === lat && city.lon === lon);
        if(aCity !== undefined){
            let cityInstance = new City(aCity);
            let dataToSend = cityInstance.data.map((val) => {
                return (new Forecast(val.valid_date,'Low of '+val.high_temp+', high of '+val.low_temp+' with '+val.weather.description));
            });
            response.status(200).send(dataToSend);
        }else{
            throw new Error('City not found in weather.');
        }
    }catch(error){
        console.log(error);
        next(error);
    }
});

app.get('/weather', (request, response) => {
    try {
        console.log('In weather try');
        let lat = request.query.lat;
        let lon = request.query.lon;
        let aCity = data.find(city => city.city_name === searchQuery || city.lat === lat && city.lon === lon);
        let cityInstance = new City(aCity);
        let dataToSend = cityInstance.data.map((val) => {
            return (new Forecast(val.valid_date,'Low of '+val.high_temp+', high of '+val.low_temp+' with '+val.weather.description));
        });
        response.send(dataToSend);
    }catch(error){
        console.log(error);
    }
});

//catch-all
app.get('*', (request, response) => {
    response.send('The route was not found. Error 404');
});

//Classes
class City{
    constructor(cityObject){
        this.data = cityObject.data;
        this.city_name = cityObject.city_name;
        this.lon = cityObject.lon;
        this.lat = cityObject.lat;
        this.timezone = cityObject.timezone;
        this.country_code = cityObject.country_code;
        this.state_code = cityObject.state_code;
    }
}

class Forecast{
    constructor(date, description){
        this.date = date;
        this.description = description;
    }
}

//Errors
app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
