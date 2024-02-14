const express = require('express');
morgan = require('morgan');

const app = express();

// Logging

app.use(morgan('common'));

// Movie Data

let topMovies = [
  {
    title: 'There Will Be Blood',
    director: 'Paul Thomas Anderson',
    year: '2007'
  },
  {
    title: 'No Country For Old Men',
    director: 'Joel Cohen, Ethan Cohen',
    year: '2007'
  },
  {
    title: 'Sleeper',
    director: 'Woody Allen',
    year: '1973'
  },
  {
    title: 'Aliens',
    director: 'James Cameron',
    year: '1986'
  },
  {
    title: 'Jackie Brown',
    director: 'Quentin Tarantino',
    year: '1997'
  },
  {
    title: 'The Witch',
    director: 'Robert Eggers',
    year: '2015'
  },
  {
    title: 'Toy Story',
    director: 'John Lasseter',
    year: '1995'
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese',
    year: '1990'
  },
  {
    title: 'The Good, the Bad and the Ugly',
    director: 'Sergio Leone',
    year: '1966'
  },
  {
    title: 'Big Fish',
    director: 'Tim Burton',
    year: '2003'
  }
];

// Logger

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(myLogger);

// GET requests

// Default Route

app.get('/', (req, res) => {
  res.send('Silence you cell phones, please!');
});

//Static file - Documentation Route

app.use('/documentation', express.static('public', {index: 'documentation.html'}));

// Movie Route

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Error Handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Looks Like We Misses Our Mark...Take Two');
});

// Listen for Requests

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});