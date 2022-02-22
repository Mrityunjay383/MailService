const express = require("express");
const router = express.Router();
const session = require('express-session');
const passport = require('passport');


const { genKey } = require('../midelwares/helper.js');

const User = require("../models/user");

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
// Google OAuth callback
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
// Github OAuth callback
router.get('/github/mailS',
  passport.authenticate('github', { failureRedirect: '/auth' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// Rendring registor page on route /auth
router.get("/", (req, res) => {

  res.render("register");
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
