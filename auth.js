// Log in end point
// Authenticate HTTP and generate JWT

const jwtSecret = 'your_jwt_secret'; // Same key used in JWT Strategy
const jwt = require('jsonwebtoken'),
passport = require('passport');
require('./passport'); // Local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // Encoding username in JWT
        expiresIn: '7d',  // Specified token expiration
        algorithm: 'HS256' // Signs (encodes) JWT Value
    });
}

// POST 

module.exports = (router) => {
    router.post('/login', (req, res) => {
      passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Invalid Username or Password',
            user: user
          });
        }
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          let token = generateJWTToken(user.toJSON());
          return res.json({ user, token });
        });
      })(req, res);
    });
  }


