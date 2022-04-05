require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const Author = require("./models/author");

passport.use(
  new LocalStrategy((username, password, done) => {
    Author.findOne({ username: username }, (err, author) => {
      if (err) return done(err);
      if (!author) return null, false, { message: "Incorrect username" };
      bcrypt.compare(password, author.password, (err, res) => {
        if (err) return done(err);
        if (res) return done(null, author);
        else return done(null, false, { message: "Incorrect password" });
      });
    });
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET,
    },
    async function (jwtPayload, cb) {
      try {
        const author = await Author.findById(jwtPayload.id);
        return cb(null, author);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

module.exports = passport;
