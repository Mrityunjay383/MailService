const express = require("express");
const router = express.Router();

const { auth, isLogedIn } = require('../midelwares/auth.js');


router.get("/", isLogedIn, auth, (req, res) => {
  res.render("dashboard", {isLogedIn: req.isLogedIn});
});


module.exports = router;
