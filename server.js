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


app.get('/',(request, response) => {
    response.send('Active');
});

/* //add a pizza route
app.get('/pizza', (request, response) => {
    try{
      let pizzaType = request.query.pizzatype;
      // http://localhost:3001/pizza?pizzatype=Chicago%20Pizza
      //add data file and look at find(will find the first and returns only that match)
      // let dataToSend = data.find(pizza => pizza.pizzatype === pizzaType);
      let dataToInstant = data.find(pizza => pizza.pizzatype === pizzaType);
      let dataToSend = new Pizza(dataToInstant);
      response.send(dataToSend);
      // now create a class below
    } catch(error){
      //create a new instance of error.
      next(error);
      // this will instantiate any new error
    }
  }); */

//catch-all
app.get('*',(request,response) => {
  response.send('The route was not found. Error 404');
});

//Classes

//Errors
app.use((error, request, response, next) =>{
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
