const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const User = require('../models/userModel.js');
const Movie = require('../models/movieModel.js');

// GET all movies
router.get('/', async (req, res) => {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).send('Error: ' + err.message);
    }
  });
  
  // GET data about a single movie by title
  router.get('/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const movie = await Movie.findOne({ title: req.params.title });
      if (!movie) return res.status(404).send('Movie not found');
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).send('Error: ' + err.message);
    }
  });

// POST a new movie
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// DELETE a movie by title
router.delete('/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const deletedMovie = await Movie.findOneAndRemove({ title: req.params.title });
      if (!deletedMovie) return res.status(404).send('Movie not found');
      res.status(200).send(`Movie titled "${req.params.title}" was deleted.`);
    } catch (err) {
      res.status(500).send('Error: ' + err.message);
    }
  });

// PUT (Update) the genre of a movie by title
router.put('/:title/genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
router.put('/:title/director', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

  module.exports = router;  // Correct module export
