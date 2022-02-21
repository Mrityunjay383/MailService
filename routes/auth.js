const express = require("express");
const router = express.Router();
const session = require('express-session');
const passport = require('passport');

const { auth, isLogedIn } = require('../midelwares/auth.js');

const { genKey } = require('../midelwares/helper.js');

const User = require("../models/user");

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/mailS',
  passport.authenticate('google', { failureRedirect: '/auth' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// Github OAuth routes
router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

router.get('/github/mailS',
  passport.authenticate('github', { failureRedirect: '/auth' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

router.get("/", isLogedIn, (req, res) => {

  res.render("register");
});


// Local Authentication
router.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
});

router.post("/register", (req, res) => {

  const reqUser = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
  }

  User.register({username: reqUser.username}, reqUser.password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/auth");
      } else {
        user.name = reqUser.name;

        user.apiKey = genKey();
        user.noOfCalls = 100;

        user.save();
      }

      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
