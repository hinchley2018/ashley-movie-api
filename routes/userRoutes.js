const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const movie = require('../models/userModel.js');

// POST new Users
router.post('/',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = User.hashPassword(req.body.Password);
    await User.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
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

// POST users' favorite movies
router.post('/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// DELETE favorite movie
router.delete('/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).send('User was successfully deregistered');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// PUT to update the user by ID
router.put('/:id',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], passport.authenticate('jwt', { session: false }), async (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // Proceed with updating the user if validation passes
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          Username: req.body.Username,
          Password: User.hashPassword(req.body.Password),  // Hash the new password
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      }, { new: true });

      if (!updatedUser) {
        return res.status(404).send('User not found');
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send('Error: ' + error);
    }
});

module.exports = router;