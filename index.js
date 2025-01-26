const mongoose = require('mongoose');
const Models = require('./models');
const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');
const app = express();
const { error } = require('console');
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const Movies = Models.Movie;
const Users = Models.User;

app.use(cors())

let allowedOrigins = ['http://localhost:3000','http://localhost:8080', 'http://localhost:1234', 'http://testsite.com', 'https://git.heroku.com/my-cinema-selector.git'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common'));
// app.use(bodyParser.urlencoded({ extended: true }));

// Import auth and passport

let auth = require('./auth')(app);  // app ensures Express in auth.js
const passport = require('passport');
require('./passport');

// Connect to mfDB

// let myLogger = (req, res, next) => {
//     console.log(req.url);
//     next();
//   };

//   app.use(myLogger);

// mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });

 mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// User requests

//Add user

app.post('/users', 

// Validation for registration

[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {

// Send validation results

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

// Registration password hash

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users

app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username

app.put('/users/:Username',  passport.authenticate('jwt', { session: false }), async (req, res) => {
        // Auth Check
        if(req.user.Username !== req.params.Username){
          return res.status(400).send('Permission denied');
      }
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) 
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error:" + err);
  })

});

// Add a movie to a user's list of favorites

app.post('/users/:Username/movies/:title',  passport.authenticate('jwt', { session: false }), async (req, res) => {
        // Auth Check
        if(req.user.Username !== req.params.Username){
          return res.status(400).send('Permission denied');
      }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.title }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

// Delete favorite movie

app.delete('/users/:Username/movies/:title',  passport.authenticate('jwt', { session: false }), async (req, res) => {
      // Auth Check
      if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.title }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

// Delete a user by username

app.delete('/users/:Username',  passport.authenticate('jwt', { session: false }), async (req, res) => {
      // Auth Check
      if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// GET all movies

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
  .then((movies)=>{
    res.status(201).json(movies);
  })  
  .catch((err) =>{
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET movies by title name

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) =>{
  await Movies.findOne({Title: req.params.title})
  .then((movie)=>{
      res.json(movie);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET genres

  app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async(req, res) => {
  await Movies.findOne({"Genre.Name": req.params.genreName})
    .then((genre) =>{
     res.status(201).json(genre)
  })
    .catch((err) =>{
    console.log(err);
    res.send(500).send('Error: ' + err)
  });
  });

// GET Directors

app.get('/movies/director/:directorName',passport.authenticate('jwt', { session: false }), async (req, res) =>{
  await Movies.findOne({"Director.Name": req.params.directorName})
  .then((directors)=>{
      if (!directors) {
          res.status(400).send(req.params.directorName + ' was not found.');
  }   else{
          res.json(directors);
      }
      
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Default route

app.get('/', (req, res) => {
  res.send('Welcome to my movie app!  No need to silence your phone!');
});
  
//Static file - Documentation Route

app.use('/documentation', express.static('public', {index: 'documentation.html'}));

// Error Handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Looks Like We Misses Our Mark...Take Two');
 });

 // Listen for Requests

 const port = process.env.PORT || 8080;
 app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
 });