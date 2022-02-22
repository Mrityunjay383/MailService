const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const {genKey} = require('../midelwares/helper.js');

const userSchema = new mongoose.Schema({
  name: String,
  apiKey: String,
  noOfCalls: Number,
  googleId: String,
  githubId: String,
  username: String,
  mailDetails: Object
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);


passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/mailS",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, function (err, user) {
      if(!user.apiKey){
          user.apiKey = genKey();
          user.noOfCalls = 100;
          user.name = profile.displayName;
          user.save();
      }
      return cb(err, user);
    });
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/mailS"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ username: profile.username, githubId: profile.id }, function (err, user) {
      if(!user.apiKey){
          user.apiKey = genKey();
          user.noOfCalls = 100;
          user.name = profile.displayName;
          user.save();
      }
      return done(err, user);
    });
  }
));

module.exports = User;
