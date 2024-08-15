const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

let topMovies = [
  { title: 'The Texas Chainsaw Massacre', director: 'Tobe Hooper' },
  { title: 'A Nightmare on Elm Street', director: 'Wes Craven' },
  { title: 'The Fog', director: 'John Carpenter' },
{ title: 'Deep Red', director: 'Dario Argento' },
{ title: 'The Fly', director: 'David Cronenberg' },
{ title: 'Ju-on: The Grudge', director: 'Takashi Shimizu' },
{ title: 'A Bay of Blood', director: 'Mario Bava' },
{ title: 'Re-Animator',  director: 'Stuart Gordon' },
{ title: 'Psycho', director: 'Alfred Hitchcock' },
{ title: 'Terrifier', director: 'Damien Leone' },
];

app.get('/movies', (req, res) => {
  res.json(topMovies);

});

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops! Something went wrong!');
});

app.listen(3000, () => {
  console.log('Your app is listening on port 3000.');
});