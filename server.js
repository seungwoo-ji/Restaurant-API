/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Seung Woo Ji Student ID: 116376195 Date: May 27, 2021
 * Heroku Link: https://enigmatic-sea-88422.herokuapp.com/
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
      res.status(500).json({ message: err.message });
    });
});

// Get restaurants for a specific page and perPage as well as borough if provided
app.get('/api/restaurants', (req, res) => {
  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((restaurants) => {
      res.json(restaurants);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Get a restaurant
app.get('/api/restaurants/:id', (req, res) => {
  db.getRestaurantById(req.params.id)
    .then((restaurant) => {
      res.json(restaurant);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Update a restaurant
app.put('/api/restaurants/:id', (req, res) => {
  db.updateRestaurantById(req.body, req.params.id)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Delete a restaurant
app.delete('/api/restaurants/:id', (req, res) => {
  db.deleteRestaurantById(req.params.id)
    .then((msg) => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

// Resource not found
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
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
