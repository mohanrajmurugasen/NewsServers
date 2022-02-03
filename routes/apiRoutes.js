const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const db = require("../models");
const valid = require("../authenication/valid");

router.use(cors());

process.env.SECRET_KEY = "user";

router.get("/", (req, res) => {
  res.send("Welcome Buddies !!");
});

router.post("/register", (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    plan: req.body.plan,
    password: req.body.password,
  };

  db.new
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((data) => {
      if (!data) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          db.new
            .create(userData)
            .then((user) => {
              res.send(user.email + "Registered");
            })
            .catch((err) => {
              res.send(err.message);
            });
        });
      } else {
        res.send("User already exist");
      }
    })
    .catch((err) => {
      res.send(err.message);
    });
});

router.post("/login", async (req, res) => {
  await db.new
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.name, process.env.SECRET_KEY);
          let email = user.email;
          let id = user.id;
          res.send({ token, email, id });
        } else {
          res.send("Password mismatch");
        }
      } else {
        res.send("User not exist");
      }
    })
    .catch((err) => {
      console.error(err.message);
    });
});

router.get("/allUsers", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.new
        .findAll()
        .then((user) => {
          res.send(user);
        })
        .catch((err) => res.send(err.message));
    }
  });
});

module.exports = router;
