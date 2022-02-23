const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

const { auth, isLogedIn } = require('../midelwares/auth.js');

const User = require("../models/user");

// Razorpay Intergation
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Dashboard route, rendering page
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
router.post("/updateMailDetails", auth, (req, res) => {
  User.findOne({_id: req.user._id}, (err, foundUser) => {

    // Updating mailDetails accouding to user wants
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

router.get("/add-credit", auth, (req, res) => {
  res.render("addCredits", {razorpayKEYID: process.env.RAZORPAY_KEY_ID, name: req.user.name});
});

// Razorpay generating new oder router
router.post("/order", (req, res) => {
  const options = {
    amount: req.body.amountVal * 100,
    currency: "INR"
  }

  razorpay.orders.create(options, (err, order) => {
    req.session.order = order;
    res.json(order);
  });
});

router.post("/is-order-complete", (req, res) => {

  razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument) => {
    if(paymentDocument.status == "captured"){

      User.findOne({_id: req.user._id}, (err, foundUser) => {
        foundUser.noOfCalls += req.session.order.amount;
        foundUser.save();
        res.redirect("/dashboard");
      });
    }else{
      res.send("Payment is not Successful");
    }
  })

});


module.exports = router;
