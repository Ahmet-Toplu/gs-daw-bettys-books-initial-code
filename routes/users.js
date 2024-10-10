// Create a new router
const bcrypt = require("bcrypt");
const saltRounds = 10;

const express = require("express");
const router = express.Router();

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

router.post("/registered", function (req, res, next) {
  // saving data in database
  const plainPassword = req.body.password;
  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    // Store hash in your password DB.
    let sqlquery =
      "INSERT INTO users (username, first_name, last_name, email, password) VALUES (?,?,?,?,?)";
    let newrecord = [
      req.body.first,
      req.body.last,
      req.body.email,
      req.body.username,
      hashedPassword,
    ];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        next(err);
      } else {
        result =
          "Hello " +
          req.body.first +
          " " +
          req.body.last +
          " you are now registered!  We will send an email to you at " +
          req.body.email;
        result +=
          " Your password is: " +
          req.body.password +
          " and your hashed password is: " +
          hashedPassword;
        res.send(result);
      }
    });
  });
});

// Export the router object so index.js can access it
module.exports = router;
