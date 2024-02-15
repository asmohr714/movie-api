const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

// Log Requests

app.use(morgan('common'));

// Users

let users = [
  {
    id: 1,
    name: 'Tom',
    favoriteMovies: ['Aliens']
  },
  {
    id: 2,
    name: 'Tim',
    favoriteMovies: ['Sleeper']
  }
]

// Movie Data

 let topMovies = [
   {
     title: 'There Will Be Blood',
     year: '2007',
     description: 'Period drama about an oilman on a ruthless quest for wealth.',
     director: {
      directorName: 'Paul Thomas Anderson',
      birth: 'June 26, 1970',
     },
     genre: {
      genreName: 'Drama',
      genreDescription: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. '
     }
   },
   {
     title: 'No Country For Old Men',
     year: '2007',
     description:'sStory of three main characters who stumble upon a large sum of money in the desert.',
     director: {
      directorName: 'Joel Cohen, Ethan Cohen',
      birth: 'November 29, 1954; September 21, 1975',
     },
     genre: {
      genreName: 'Thriller',
      genreDescription: 'Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror, and detective fiction. Thrillers are characterized and defined by the moods they elicit, giving their audiences heightened feelings of suspense, excitement, surprise, anticipation and anxiety.'
     }
   },
   {
     title: 'Sleeper',
     description: 'Follows a man who is cryogenically frozen in 1973 and defrosted 200 years later.',
     year: '1973',
     director: {
      directorName: 'Woody Allen',
      birth: 'November 20, 1935',
     },
     genre: {
      genreName: 'Comedy',
      genreDescription: 'A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh. Films in this genre typically have a happy ending, with dark comedy being an exception to this rule.'
     }
   },
   {
     title: 'Aliens',
     description: 'Colonial Marines investigate a space colony when communication is lost.',
     year: '1986',
     director: {
      directorName: 'James Cameron',
      birth: 'August 16, 1954',
     },
     genre: {
      genreName: 'Sci-fi Action',
      genreDescription: 'shootouts, explosions, and stunt work. The specifics of what constitutes an action film has been in scholarly debate since the 1980s. '

     }
   },
   {
     title: 'Jackie Brown',
     description: 'Follows a flight attendant who smuggles money between the United States and Mexico',
     year: '1997',
     director: {
      directorName: 'Quentin Tarantino',
      birth: 'March 27, 1963',
     },
     genre: {
      genreName: 'Crime Drama',
      genreDescription: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. '
     }
   },
   {
     title: 'The Witch',
     decsription:'English settlers are banished from a Puritan community.',
     year: '2015',
     director: {
      directorName: 'Robert Eggers',
      birth: 'July 7, 1983',
     },
     genre: {
      genreName: 'Horror',
      genreDescription: 'Horror is a film genre that seeks to elicit fear or disgust in its audience for entertainment purposes. Horror films often explore dark subject matter and may deal with transgressive topics or themes.'
     }
   },
   {
     title: 'Toy Story',
     description: 'A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy.',
     year: '1995',
     director: {
      directorName: 'John Lasseter',
      birth: 'January 12, 1957',
     },
     genre: {
      genreName: 'Comedy',
      genreDescription: 'A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh. Films in this genre typically have a happy ending, with dark comedy being an exception to this rule.'
     }
   },
   {
     title: 'Goodfellas',
     description: 'Narrates the rise and fall of mob associate Henry Hill.',
     year: '1990',
     director: {
      directorName: 'Martin Scorsese',
      birth: 'November 17, 1942',
     },
     genre: {
      genreName: 'Crime Drama',
      genreDescription: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. '
     }
   },
   {
     title: 'The Good, the Bad and the Ugly',
     description: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
     year: '1966',
     director: {
      directorName: 'Sergio Leone',
      birth: 'January 3, 1929',
     },
     genre: {
      genreName: 'Western',
      genreDescription: 'The Western is a genre of fiction typically set in the American frontier between the California Gold Rush of 1849 and the closing of the frontier in 1890, and commonly associated with folk tales of the Western United States.'
     }
   },
   {
     title: 'Big Fish',
     description: 'A son tries to reconcile with his dying father.',
     year: '2003',
     director: {
      directorName: 'Tim Burton',
      birth: 'August 25, 1958',
     },
     genre: {
      genreName: 'Fantasy Drama',
      genreDescription: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. '
     }
   }
 ];


// User requests

// Create new user -- POST

app.post('/users',(req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)

  } else {

    res.status(400).send('User name required')
  }
})

// Update user info -- PUT

app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);

  } else {

    res.status(400).send('There is no such user')
  }
})

// Create favorite movie for user -- POST

app.post('/users/:id/:movieTitle', (req, res) => {
  const id = req.params.id;
  const movieTitle = req.params.movieTitle;

  let user = users.find( user => user.id == id );


  if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(movieTitle + ' has been added to user ' + id + '\'s array');
 
    } else {

      res.status(400).send('There is no such user')
  }
})

// Delete favorite movie -- DELETE

app.delete('/users/:id/:movieTitle', (req, res) => {
  const id = req.params.id;
  const movieTitle = req.params.movieTitle;

  let user = users.find( user => user.id == id );


  if (user) {
      user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
      res.status(200).send(movieTitle + ' has been removed from user ' + id + '\'s array.');
  
    } else {

      res.status(400).send('There is no such user')
  }
})

// Delete user -- DELETE

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  let user = users.find( user => user.id == id );


  if (user) {
      users = users.filter( user => user.id != id);
      res.status(200).send('User ' + id + ' has been deleted.');

  } else {

      res.status(400).send('There is no such user')
  }
})

// Default route

app.get('/', (req, res) => {
   res.send('Welcome to my movie app!  No need to silence your phone!');
 });

// Gets the list of data about ALL movies -- GET

app.get('/movies', (req, res) => {
res.json(topMovies);
});

// Gets the data about a movie by title -- GET

app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = topMovies.find( movie => movie.title === title );

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(400).send('Movie not found.')
  }
})

// Gets genre by name -- GET

app.get('/movies/genre/:genreName', (req, res) => {
  const genreName = req.params.genreName;
  const genre = topMovies.find( movie => movie.genre.genreName === genreName ).genre;

  if (genre) {
      res.status(200).json(genre);
  } else {
      res.status(400).send('Genre not found.')
  }
})

// Gets director by name -- GET

app.get('/movies/directors/:directorName', (req, res) => {
  const directorName = req.params.directorName;
  const director = topMovies.find( movie => movie.director.directorName === directorName ).director;

  if (director) {
      res.status(200).json(director);
  } else {
      res.status(400).send('Director not found.')
  }
})
  
//Static file - Documentation Route

app.use('/documentation', express.static('public', {index: 'documentation.html'}));

// Error Handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Looks Like We Misses Our Mark...Take Two');
 });

 // Listen for Requests

 app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
 });
