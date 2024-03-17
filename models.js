const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // Node hash module

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
    FavoriteMovies: [{ type: string, req: ture }]
  });

// Hash auth credentials

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let directorSchema = mongoose.Schema({
  Name:{type: String, required: true},
  Bio:{type: String, required: true},
  birthDate: {type: Date},
  DeathDate: {type: Date},
}, {
  collection: "directors"
});

let genreSchema = mongoose.Schema({
  _id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true},
  Name:{type: String, required: true},
  Description:{type: String, required: true} 
});
  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);

  
  module.exports.Movie = Movie;
  module.exports.User = User;
 