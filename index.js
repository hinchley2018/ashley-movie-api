const express = require('express');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

let topMovies = [
  { 
    id: uuidv4(),
    title: 'The Texas Chainsaw Massacre', 
    director: 'Tobe Hooper', 
    description: 'A group of friends fall victim to a family of cannibals.',
    genre: 'Horror', 
    imageUrl: 'https://placeholder.com/texas-chainsaw.jpg'
  },
  { 
    id: uuidv4(),
    title: 'A Nightmare on Elm Street', 
    director: 'Wes Craven',
    description: 'A teenager is haunded by a disfigured killer in her dreams.', 
    genre: 'Horror',
    imageUrl: 'https://placeholder.com/nighmare-elm.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'The Fog', 
    director: 'John Carpenter',
    description: 'A small coastal town is enveloped by a thick fog that brings vengeful spirits.',
    genre: 'Horror', 
    imageUrl: 'https://placeholder.com/the-fog.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'Deep Red', 
    director: 'Dario Argento',
    description: 'A jazz pianist and a journalist work together to solve a series of murders in Rome.',
    genre: 'Horror',
    imageUrl: 'https://placeholder.com/deep-red.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'The Fly', 
    director: 'David Cronenberg',
    description: 'A scientist’s experiment goes horribly wrong, turning him into a human-fly hybrid.',
    genre: 'Horror',
    imageUrl: 'https://placeholder.com/the-fly.jpg'
  },
  { 
    id: uuidv4(),
    title: 'Ju-on: The Grudge', 
    director: 'Takashi Shimizu',
    description: 'A curse that plagues a house haunts anyone who dares enter.',
    genre: 'Horror',
    imageUrl: 'https://placeholder.com/the-grudge.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'A Bay of Blood', 
    director: 'Mario Bava',
    description: 'A series of murders ensue over the ownership of a coveted bay.',
    genre: 'Horror',
    imageUrl: 'https://placeholder.com/bay-of-blood.jpg'
  },
  { 
    id: uuidv4(),
    title: 'Re-Animator',  
    director: 'Stuart Gordon',
    description: 'A medical student and his mentor develop a serum to reanimate the dead.',
    genre: 'Horror',
    imageUrl: 'https://placeholder.com/reanimator.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'Psycho', 
    director: 'Alfred Hitchcock',
    description: 'A woman steals a fortune and checks into a secluded motel run by a disturbed man.',
    genre: 'Horror',
    imageUrl: 'https://placeholder.com/psycho.jpg' 
  },
  { 
    id: uuidv4(),
    title: 'Terrifier', 
    director: 'Damien Leone',
    description: 'A maniacal clown terrorizes three women on Halloween night.',
    genre: 'Horror',
    imageUrl: 'https://placeholder.com/terrifier.jpg' 
  },
];

// GET all movies
app.get('/movies', (req, res) => {
  res.json(topMovies);

});

// GET data about a single movie by title
app.get('/movies/:title', (req,res) => {
  const movie = topMovies.find((movie) => movie.title ===req.params.title);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send('Oops! Movie not found!');
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

// DELETE a movie by title
app.delete('/movies/:title', (req, res) => {
  const movieIndex = topMovies.findIndex((movie) => movie.title === req.params.title);
  
  if (movieIndex !== -1) {
    topMovies.splice(movieIndex, 1);
    res.status(200).send(`Movie titled "${req.params.title}" was deleted.`);
  } else {
    res.status(404).send('Oops! Movie not found!');
  }
});

// PUT (Update) the genre of a movie by title
app.put('/movies/:title/:genre', (req, res) => {
  const movie = topMovies.find((movie) => movie.title === req.params.title);

  if (movie) {
    movie.genre - req.body.grene;
    res.status(200).json(movie);
  } else {
    res.status(404).send('Oops! Movie not found!');
  }
});

// PUT (Update) the director of a movie by title
app.put('/movies/:title/director', (req, res) => {
  const movie = topMovies.find((movie) => movie.title === req.params.title);
  
  if (movie) {
    movie.director = req.body.director;
    res.status(200).json(movie);
  } else {
    res.status(404).send('Movie not found');
  }
});

app.listen(3000, () => {
  console.log('Your app is listening on port 3000.');
});