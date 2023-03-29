const express = require("express");
const router = express.Router();

const {isLogedIn} = require('../midelwares/auth.js');

router.get("/", isLogedIn, (req, res) => {
    console.log(`#2023892141848 req.isLogedIn`, req.isLogedIn)
    res.render("index", {isLogedIn: req.isLogedIn});
});

module.exports = router
