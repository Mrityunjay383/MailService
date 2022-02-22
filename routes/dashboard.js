const express = require("express");
const router = express.Router();

const { auth, isLogedIn } = require('../midelwares/auth.js');

const User = require("../models/user");


// Dashboard root, rendering page
router.get("/", isLogedIn, auth, (req, res) => {

  User.findOne({_id: req.user._id}, (err, foundUser) => {
    res.render("dashboard", {isLogedIn: req.isLogedIn,
      userName: foundUser.name,
      noOfCalls: foundUser.noOfCalls,
      apiKey: foundUser.apiKey,
      mailDetails: foundUser.mailDetails
    });
  });
});

//Updating mail details routes
router.post("/addMailDetails", auth, (req, res) => {
  User.findOne({_id: req.user._id}, (err, foundUser) => {
    const mailDetails = {
      senderName: req.body.senderName,
      mailSubject: req.body.sub,
      message: req.body.message
    }

    foundUser.mailDetails = mailDetails;
    foundUser.save();
    res.redirect("/dashboard");
  });
});


module.exports = router;
