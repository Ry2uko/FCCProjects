import UserModel from './models/user.js';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    let user = await UserModel.findOne({ username }).lean();

    if (user == null) {
      return done(null, false, { message: 'User not found' });
    }

    try {
      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect username or password. '});
      }
    } catch (err) {
      return done(err);
    }
  }

  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user.username);
  });
  passport.deserializeUser((username, done) => {
    UserModel.findOne({ username }, { '__v': 0, 'password': 0 }, (err, user) => {
      done(err, user);
    });
  });
}

export default initialize;