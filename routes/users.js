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

router.get("/listusers", function (req, res, next) {
  // everything from users table except for password
  let sqlquery = "SELECT username, first_name, last_name, email FROM users";
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("listusers.ejs", { availableUsers: result });
  });
});

router.get("/login", function (req, res, next) {
  res.render("login.ejs");
});

router.post("/loggedin", function (req, res, next) {
  let sqlquery = "SELECT username, password FROM users";
  let record = [req.body.username, req.body.password];
  db.query(sqlquery, record, (err, result) => {
    if (err) {
      next(err);
    } else {
      bcrypt.compare(
        req.body.password,
        result[0].password,
        function (err, result) {
          if (err) {
            next(err);
          } else if (result == true) {
            res.send("You are now logged in as " + req.body.username);
          } else {
            res.send("Invalid password");
          }
        }
      );
    }
  });
});

// Export the router object so index.js can access it
module.exports = router;
