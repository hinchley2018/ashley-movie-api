require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
require('./passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const movieRoutes = require('./routes/movieRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();

// Import models separately
const Movie = require('./models/movieModel');
const User = require('./models/userModel');

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

let auth = require('./auth')(app);

// GET data about a genre
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find({ 'Genre.Name': req.params.name });
    if (movies.length === 0) return res.status(404).send('Genre not found');
    res.status(200).json(movies.map(movie => ({
      Genre: movie.Genre,
      Description: movie.Description
    })));
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// GET data about a director
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find({ 'Director.Name': req.params.name });
    if (movies.length === 0) return res.status(404).send('Director not found');

    const directorData = movies.map(movie => ({
      title: movie.Title,
      description: movie.Description,
      genre: movie.Genre.Name,
      bio: movie.Director.Bio
    }));

    res.status(200).json(directorData);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the MyFlix API');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port http://localhost:' + port);
});

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));