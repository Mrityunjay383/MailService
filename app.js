require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const port = process.env.PORT || 3000;

// Routers
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

// Using Routes
app.use("/", indexRouter);
app.use("/auth", authRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
