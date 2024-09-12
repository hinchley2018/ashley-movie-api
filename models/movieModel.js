const mongoose = require('mongoose');
const Movie = mongoose.model('Movie', movieSchema);

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String
    },
});
  
module.exports = Movie; 