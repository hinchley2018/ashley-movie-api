const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

const Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// Local strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      try {
        console.log(`${username} ${password}`);

        const user = await Users.findOne({ Username: username });
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }

        // Validate password
        if (!user.validatePassword(password)) {
          console.log('incorrect password');
          return callback(null, false, { message: 'Incorrect password.' });
        }

        console.log('finished');
        return callback(null, user); // Successful authentication
      } catch (error) {
        console.log(error);
        return callback(error);
      }
    }
  )
);

// JWT strategy for protected routes authentication
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',  // Make sure this matches the secret set in Heroku
    },
    (jwtPayload, callback) => {
      console.log('JWT Payload:', jwtPayload); // Add this to log the JWT payload
      Users.findById(jwtPayload._id)
        .then((user) => {
          if (user) {
            console.log('User found:', user); // Add this to log the found user
            return callback(null, user);
          } else {
            console.log('User not found'); // Add this if no user is found
            return callback(null, false);
          }
        })
        .catch((error) => {
          console.error('Error finding user:', error); // Add this for errors
          return callback(error);
        });
    }
  )
);