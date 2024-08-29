const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require('express');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
require('./passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const app = express();

const Movie = Models.Movie;
const User = Models.User;

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let auth = require('./auth')(app);

// GET all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// GET data about a single movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) return res.status(404).send('Movie not found');
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

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

// POST a new movie
app.post('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const newMovie = new Movie({
    Title: req.body.Title,
    Description: req.body.Description,
    Genre: {
      Name: req.body.GenreName,
      Description: req.body.GenreDescription
    },
    Director: {
      Name: req.body.DirectorName,
      Bio: req.body.DirectorBio
    }
  });

  try {
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// POST new Users
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Hash the password
  let hashedPassword = await bcrypt.hash(req.body.Password, 10);

  // Check if the username already exists
  await User.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        // Create the new user
        User.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => { res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// POST users favorite movies
app.post('/users/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).send('Movie not found');

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { FavoriteMovies: req.params.movieId } },
      { new: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// DELETE a movie by title
app.delete('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const deletedMovie = await Movie.findOneAndRemove({ title: req.params.title });
    if (!deletedMovie) return res.status(404).send('Movie not found');
    res.status(200).send(`Movie titled "${req.params.title}" was deleted.`);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// DELETE favorite movie
app.delete('/users/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { FavoriteMovies: req.params.movieId } },
      { new: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// DELETE Users
app.delete('/users/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).send('User was successfully deregistered');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// PUT (Update) the genre of a movie by title
app.put('/movies/:title/genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { Title: req.params.title },
      { 'Genre.Name': req.body.GenreName, 'Genre.Description': req.body.GenreDescription },
      { new: true }
    );
    if (!updatedMovie) return res.status(404).send('Movie not found');
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// PUT (Update) the director of a movie by title
app.put('/movies/:title/director', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { Title: req.params.title },
      { 'Director.Name': req.body.DirectorName, 'Director.Bio': req.body.DirectorBio },
      { new: true }
    );
    if (!updatedMovie) return res.status(404).send('Movie not found');
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// PUT users ID
app.put('/users/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send('User not found');
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// Start the server
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cfDB');