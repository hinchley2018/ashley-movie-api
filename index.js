const express = require('express');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

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
    movie.genre = req.body.genre;
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