// JWT Secret for signing the token
const jwtSecret = 'your_jwt_secret'; 
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Function to generate a JWT token
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // The username being encoded in the JWT
    expiresIn: '7d', // Token will expire in 7 days
    algorithm: 'HS256' // The algorithm used to sign the token
  });
};

/* POST login */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.status(500).send(error);
        }

        // Generate JWT Token
        let token = generateJWTToken(user.toJSON());
        
        // Send the user and token as a response
        return res.json({ user, token });
      });
    })(req, res); // Make sure this is outside the callback
  });
};