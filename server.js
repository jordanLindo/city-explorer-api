'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./modules/weather.js');
const movie = require('./modules/movie.js');
const { application } = require('express');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

app.get('/weather', weatherHandler);
app.get('/movie',movieHandler);

function weatherHandler(request, response) {
    const { lat, lon } = request.query;
    weather(lat, lon).then(summaries => response.send(summaries)).catch((error) => {
        console.error(error);
        response.status(200).send('Sorry. Something went wrong!');
    });
}

function movieHandler(request,response){
    const keyword = request.query;
    movie(keyword).then(summaries => response.send(summaries)).catch((error) => {
        console.error(error);
        response.status(200).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
