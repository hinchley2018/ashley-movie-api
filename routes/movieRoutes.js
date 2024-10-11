const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const User = require('../models/userModel.js');
const Movie = require('../models/movieModel.js');
const movies_temp = [
  {"_id":{"$oid":"66cc9adde6dc7e6bb62710bc"},"title":"Inception","description":"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.","Genre":{"Name":"Sci-Fi","Descrition":"Sci-Fi films often explore futuristic settings, advanced technology, space exploration, time travel, and extraterrestrial life. These movies frequently delve into the impact of scientific advancements on society and individuals, blending imaginative concepts with speculative ideas."},"Director":{"Name":"Christopher Nolan","Bio":"British-American filmmaker known for his complex storytelling and visual style.","Birth":"1970","Death":null},"ImagePath":"https://placeholder.com/inception.jpg","Featured":true},
  {"_id":{"$oid":"66ccc690e6dc7e6bb62710bd"},"title":"Interstellar","description":"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.","Genre":{"Name":"Sci-Fi","Description":"Sci-Fi films often explore futuristic settings, advanced technology, space exploration, time travel, and extraterrestrial life. These movies frequently delve into the impact of scientific advancements on society and individuals, blending imaginative concepts with speculative ideas."},"Director":{"Name":"Christopher Nolan","Bio":"British-American filmmaker known for his complex storytelling and visual style.","Birth":"1970","Death":null},"ImagePath":"https://placeholder.com/interstellar.jpg","Featured":true},
  {"_id":{"$oid":"66ccc71fe6dc7e6bb62710be"},"title":"Pulp Fiction","description":"The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.","Genre":{"Name":"Crime","Description":"Crime films focus on the world of criminal activities and the law enforcement that seeks to combat them. These movies often depict heists, organized crime, police investigations, and the moral ambiguities of those involved, sometimes blurring the lines between good and evil."},"Director":{"Name":"Quentin Tarantino","Bio":"Quentin Tarantino is an American filmmaker and screenwriter known for his unique style that blends elements of violence, humor, and pop culture references. His work is characterized by non-linear narratives, sharp dialogue, and an affinity for genre films.","Birth":"1963","Death":null},"ImagePath":"https://placeholder.com/pulp-fiction.jpg","Featured":true},
  {"_id":{"$oid":"66ccc7e0e6dc7e6bb62710bf"},"title":"Django Unchained","description":"With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.","Genre":{"Name":"Crime","Description":"Crime films focus on the world of criminal activities and the law enforcement that seeks to combat them. These movies often depict heists, organized crime, police investigations, and the moral ambiguities of those involved, sometimes blurring the lines between good and evil."},"Director":{"Name":"Quentin Tarantino","Bio":"Quentin Tarantino is an American filmmaker and screenwriter known for his unique style that blends elements of violence, humor, and pop culture references. His work is characterized by non-linear narratives, sharp dialogue, and an affinity for genre films.","Birth":"1963","Death":null},"ImagePath":"https://placeholder.com/django-unchained.jpg","Featured":true},
  {"_id":{"$oid":"66ccc86ee6dc7e6bb62710c0"},"title":"The Grand Budapest Hotel","description":"A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.","Genre":{"Name":"Western","Description":"Western films are set in the American frontier, typically during the late 19th century. They often portray cowboys, outlaws, lawmen, and indigenous peoples. The genre is known for its depiction of rugged landscapes, moral dilemmas, and themes of justice, revenge, and survival."},"Director":{"Name":"Wes Anderson","Bio":"Wes Anderson is an American filmmaker known for his distinctive visual and narrative style, characterized by symmetrical compositions, quirky characters, and whimsical storylines. His films often explore themes of family, nostalgia, and melancholy.","Birth":"1969","Death":null},"ImagePath":"https://placeholder.com/grand-budapest.jpg","Featured":true},
  {"_id":{"$oid":"66ccc945e6dc7e6bb62710c1"},"title":"The Royal Tenenbaums","description":"The eccentric members of a dysfunctional family reluctantly gather under the same roof for various reasons.","Genre":{"Name":"Western","Description":"Western films are set in the American frontier, typically during the late 19th century. They often portray cowboys, outlaws, lawmen, and indigenous peoples. The genre is known for its depiction of rugged landscapes, moral dilemmas, and themes of justice, revenge, and survival."},"Director":{"Name":"Wes Anderson","Bio":"Wes Anderson is an American filmmaker known for his distinctive visual and narrative style, characterized by symmetrical compositions, quirky characters, and whimsical storylines. His films often explore themes of family, nostalgia, and melancholy.","Birth":"1969","Death":null},"ImagePath":"https://placeholder.com/royal-tenenbaums.jpg","Featured":true},
  {"_id":{"$oid":"66ccc9d0e6dc7e6bb62710c2"},"title":"Fight Club","description":"An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.","Genre":{"Name":"Drama","Description":"Drama films are characterized by their focus on realistic storytelling and emotional depth. They often explore complex human experiences, relationships, and moral dilemmas. These movies aim to evoke strong emotions, offering insight into the human condition."},"Director":{"Name":"David Fincher","Bio":"David Fincher is an American film director and producer known for his meticulous attention to detail and dark, psychologically complex narratives. His films often explore themes of obsession, power, and human nature.","Birth":"1962","Death":null},"ImagePath":"https://placeholder.com/fight-club.jpg","Featured":true},
  {"_id":{"$oid":"66ccca59e6dc7e6bb62710c3"},"title":"Gone Girl","description":"With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent.","Genre":{"Name":"Drama","Description":"Drama films are characterized by their focus on realistic storytelling and emotional depth. They often explore complex human experiences, relationships, and moral dilemmas. These movies aim to evoke strong emotions, offering insight into the human condition."},"Director":{"Name":"David Fincher","Bio":"David Fincher is an American film director and producer known for his meticulous attention to detail and dark, psychologically complex narratives. His films often explore themes of obsession, power, and human nature.","Birth":"1962","Death":null},"ImagePath":"https://placeholder.com/gone-girl.jpg","Featured":true},
  {"_id":{"$oid":"66cccae6e6dc7e6bb62710c4"},"title":"The Godfather","description":"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.","Genre":{"Name":"Thriller","Description":"Thriller films are designed to create tension, excitement, and suspense. They often involve high-stakes situations, such as crime, espionage, or psychological manipulation. Thrillers keep the audience on the edge of their seats, with plot twists and intense pacing."},"Director":{"Name":"Francis Ford Coppola","Bio":"Francis Ford Coppola is an American film director, producer, and screenwriter who is regarded as one of the most influential figures in the history of cinema. He gained fame in the 1970s with films like The Godfather Trilogy and Apocalypse Now.","Birth":"1939","Death":null},"ImagePath":"https://placeholder.com/the-godfather.jpg","Featured":true},
  {"_id":{"$oid":"66cccc42e6dc7e6bb62710c5"},"title":"Apocalypse Now","description":"A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god.","Genre":{"Name":"Thriller","Description":"Thriller films are designed to create tension, excitement, and suspense. They often involve high-stakes situations, such as crime, espionage, or psychological manipulation. Thrillers keep the audience on the edge of their seats, with plot twists and intense pacing."},"Director":{"Name":"Francis Ford Coppola","Bio":"Francis Ford Coppola is an American film director, producer, and screenwriter who is regarded as one of the most influential figures in the history of cinema. He gained fame in the 1970s with films like The Godfather Trilogy and Apocalypse Now.","Birth":"1939","Death":null},"ImagePath":"https://placeholder.com/apocalypse-now.jpg","Featured":true}

]

// GET all movies
router.get('/', async (req, res) => {
    try {
      // const movies = await Movie.find();
      // res.status(200).json(movies);
      res.status(200).json(movies_temp)
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
