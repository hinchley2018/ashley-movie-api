const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require('express');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const Movie = Models.Movie;
const User = Models.User;

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));

let topMovies = [
  { 
    id: uuidv4(),
    title: 'Inception', 
    director: 'Christopher Nolan', 
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: 'Sci-Fi', 
    imageUrl: 'https://placeholder.com/inception.jpg'
  },
  { 
    id: uuidv4(),
    title: 'Interstellar', 
    director: 'Christopher Nolan',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', 
    genre: 'Sci-Fi',
    imageUrl: 'https://placeholder.com/interstellar.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'Pulp Fiction', 
    director: 'Quentin Tarantino',
    description: 'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.',
    genre: 'Crime', 
    imageUrl: 'https://placeholder.com/pulp-fiction.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'Django Unchained', 
    director: 'Quentin Tarantino',
    description: 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.',
    genre: 'Western',
    imageUrl: 'https://placeholder.com/django-unchained.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'The Grand Budapest Hotel', 
    director: 'Wes Anderson',
    description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious years under an exceptional concierge.',
    genre: 'Comedy',
    imageUrl: 'https://placeholder.com/grand-budapest.jpg'
  },
  { 
    id: uuidv4(),
    title: 'The Royal Tenenbaums', 
    director: 'Wes Anderson',
    description: 'The eccentric members of a dysfunctional family reluctantly gather under the same roof for various reasons.',
    genre: 'Comedy',
    imageUrl: 'https://placeholder.com/royal-tenenbaums.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'Fight Club', 
    director: 'David Fincher',
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    genre: 'Drama',
    imageUrl: 'https://placeholder.com/fight-club.jpg'
  },
  { 
    id: uuidv4(),
    title: 'Gone Girl',  
    director: 'David Fincher',
    description: 'With his wife\'s disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it\'s suspected that he may not be innocent.',
    genre: 'Thriller',
    imageUrl: 'https://placeholder.com/gone-girl.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'The Godfather', 
    director: 'Francis Ford Coppola',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    genre: 'Crime',
    imageUrl: 'https://placeholder.com/the-godfather.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'Apocalypse Now', 
    director: 'Francis Ford Coppola',
    description: 'A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god.',
    genre: 'War',
    imageUrl: 'https://placeholder.com/apocalypse-now.jpg' 
  },
];

// GET all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// GET data about a single movie by title
app.get('/movies/:title', async (req, res) => {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) return res.status(404).send('Movie not found');
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// GET data about a genre
app.get('/genres/:name', async (req, res) => {
  try {
    // Assuming you need to get all movies with this genre
    const movies = await Movie.find({ genre: req.params.name });
    if (!movies.length) return res.status(404).send('Genre not found');
    res.status(200).json({ genre: req.params.name, movies });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// GET data about a director
app.get('/directors/:name', async (req, res) => {
  try {
    // Assuming you need to get all movies by this director
    const movies = await Movie.find({ director: req.params.name });
    if (!movies.length) return res.status(404).send('Director not found');
    res.status(200).json({ director: req.params.name, movies });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// POST a new movie
app.post('/movies', (req, res) => {
  const newMovie = {
    id: uuidv4(),
    title: req.body.title,
    director: req.body.director, 
    genre: req.body.genre,
    imageUrl: req.body.imageUrl
};

  if (!newMovie.title || !newMovie.director) {
    res.status(400).send('Opps! Missing required fields: title or director');
  } else {
    topMovies.push(newMovie);
    res.status(201).json(newMovie);
  }
});

// POST new Users
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// POST users favorite movies
app.post('/users/:id/favorites/:movieId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// DELETE a movie by title
app.delete('/movies/:title', async (req, res) => {
  try {
    const deletedMovie = await Movie.findOneAndRemove({ title: req.params.title });
    if (!deletedMovie) return res.status(404).send('Movie not found');
    res.status(200).send(`Movie titled "${req.params.title}" was deleted.`);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// DELETE favorite movie
app.delete('/users/:id/favorites/:movieId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// DELETE Users
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).send('User was successfully deregistered');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// PUT (Update) the genre of a movie by title
app.put('/movies/:title/genre', async (req, res) => {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { title: req.params.title },
      { genre: req.body.genre },
      { new: true }
    );
    if (!updatedMovie) return res.status(404).send('Movie not found');
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// PUT (Update) the director of a movie by title
app.put('/movies/:title/director', async (req, res) => {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { title: req.params.title },
      { director: req.body.director },
      { new: true }
    );
    if (!updatedMovie) return res.status(404).send('Movie not found');
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// PUT users ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });