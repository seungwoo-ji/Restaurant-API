/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Seung Woo Ji Student ID: 116376195 Date: May 27, 2021
 * Heroku Link:
 *
 ********************************************************************************/

// Web service setup
const express = require('express');
const cors = require('cors');
const RestaurantDB = require('./modules/restaurantDB.js');
const app = express();
const db = new RestaurantDB(
  'mongodb+srv://dbUser:swji1@cluster0.r9bmq.mongodb.net/sample_restaurants?retryWrites=true&w=majority'
);
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// Route to check if service is set up correctly to run
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

// Add new restaurant
app.post('/api/restaurants', (req, res) => {
  db.addNewRestaurant(req.body)
    .then((msg) => {
      res.status(201).json({ message: msg });
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

// Get restaurant for a specific page and perPage as well as borough if provided
app.get('/api/restaurants', (req, res) => {
  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((restaurants) => {
      restaurants.length ? res.json(restaurants) : res.status(404).json({ message: 'Resource not found' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message }); // status 500 for server error (e.g. when parameters are missing)
    });
});

// Get a restaurant
app.get('/api/restaurants/:id', (req, res) => {
  db.getRestaurantById(req.params.id)
    .then((restaurant) => {
      restaurant ? res.json(restaurant) : res.status(404).json({ message: 'Resource not found' });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message }); // status 500 for server error
    });
});

// Update a restaurant
app.put('/api/restaurants/:id', (req, res) => {
  var id = req.params.id;

  db.getRestaurantById(id)
    .then((restaurant) => {
      // Check if the restaurant id to update exists in the database. If not, return 404 error message
      return restaurant ? Promise.resolve() : Promise.reject(new Error('Resource not found'));
    })
    .then(() => {
      return db.updateRestaurantById(req.body, id);
    })
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      err.message == 'Resource not found'
        ? res.status(404).json({ message: err.message })
        : res.status(500).json({ message: err.message }); // status 500 for server error
    });
});

// Delete a restaurant
app.delete('/api/restaurants/:id', (req, res) => {
  var id = req.params.id;

  db.getRestaurantById(id)
    .then((restaurant) => {
      // Check if the restaurant id to delete exists in the database. If not, return 404 error message
      return restaurant ? Promise.resolve() : Promise.reject(new Error('Resource not found'));
    })
    .then(() => {
      return db.deleteRestaurantById(id);
    })
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      err.message == 'Resource not found'
        ? res.status(404).json({ message: err.message })
        : res.status(500).json({ message: err.message }); // status 500 for server error
    });
});

db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
