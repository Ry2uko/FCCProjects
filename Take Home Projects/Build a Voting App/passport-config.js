import UserModel from './models/user.js'
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';

function initialize(passport) {
  const authenticateUser = async (login, password, done) => {
    let user;

    login.includes('@')
    ? user = await UserModel.findOne({ email: login }).lean()
    : user = await UserModel.findOne({ username: login }).lean();

    if (user == null) {
      return done(null, false, { message: 'User does not exist.' });
    }

    try {
      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect user or password.' });
      } 
    } catch (err) {
      return done(err);
    }
  }

  passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password' 
  }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    UserModel.findOne({ username }, { '__v': 0, 'password': 0, 'email': 0 }, (err, user) => {
      done(err, user);
    });
  });
}

export default initialize;