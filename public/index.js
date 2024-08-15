const express = require('express');
const app = express();
;

let topMovies = [
  {
    title: 'The Texas Chainsaw Massacre',
    director: 'Tobe Hooper'
  },
  {
    title: 'A Nightmare on Elm Street',
    director: 'Wes Craven'
  },
  {
    title: 'The Fog',
    director: 'John Carpenter'
  },
{
  title: 'Deep Red',
  director: 'Dario Argento'
},
{
  title: 'The Fly',
  director: 'David Cronenberg'
},
{
  title: 'Ju-on: The Grudge',
  director: 'Takashi Shimizu'
},
{
  title: 'A Bay of Blood',
  director: 'Mario Bava'
},
{
  title: 'Re-Animator',
  director: 'Stuart Gordon'
},
{
  title: 'Psycho',
  director: 'Alfred Hitchcock'
},
{
  title: 'Terrifier',
  director: 'Damien Leone'
},
];

app.use(express.static('public'));

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});