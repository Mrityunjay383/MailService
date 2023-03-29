const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport')
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const {genKey} = require('../midelwares/helper.js');

const userSchema = new mongoose.Schema({
  name: String,
  apiKey: {
    type: String,
    default: genKey()
  },
  noOfCalls: {
    type: Number,
    default: 100
  },
  googleId: String,
  githubId: String,
  username: String,
  mailDetails: {
    type: Object,
    default: {
      senderName: "MailBot",
      mailSubject: "OTP for Registration",
      message: "An example of a good thank you message"
    }
  }
});

userSchema.plugin(passportLocalMongoose);

//findOrCreate is an external function user to create new user if user didnt exist, and find if user already exist
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);


passport.use(User.createStrategy());


//Serializing User
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Deserializing User
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// Strategy to implement Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://mailservice.cyclic.app/auth/google/mailS",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {//callback with profile details from google
    User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, function (err, user) {
      if(!user.name){
          // user.apiKey = genKey();//genrating unique Key for future User
          user.name = profile.displayName;
          user.save();
      }
      return cb(err, user);
    });
  }
));

// Strategy to implement Github OAuth
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://mailservice.cyclic.app/auth/github/mailS"
  },
  function(accessToken, refreshToken, profile, done) {//callback with profile details from github
    User.findOrCreate({ username: profile.username, githubId: profile.id }, function (err, user) {
      if(!user.name){
          // user.apiKey = genKey();//genrating unique Key for future User
          user.name = profile.displayName;
          user.save();
      }
      return done(err, user);
    });
  }
));

module.exports = User;
