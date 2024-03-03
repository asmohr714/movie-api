const mongoose = require('mongoose');

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
  }});

  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

let directorSchema = mongoose.Schema({
  _id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Directors', required: true},
  Name:{type: String, required: true},
  Bio:{type: String, required: true}, 
  birthDate: Date,
  DeathDate: Date   
});

 let genreSchema = mongoose.Schema({
   _id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true},
   Name:{type: String, required: true},
   Description:{type: String, required: true} 
 });
  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  let Director = mongoose.model ('Director',directorSchema);
   let Genre = mongoose.model('Genre', genreSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;
  module.exports.Director = Director;
  module.exports.Genre = Genre;