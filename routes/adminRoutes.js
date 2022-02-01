const express = require("express");
const router = express.Router();
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { json } = require("body-parser");
const valid = require("../authenication/valid");

router.use(cors());

/**
 */

process.env.SECRET_KEYS = "admin";

router.post("/adminregister", (req, res) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
    interface: req.body.interface,
  };

  db.admin
    .findOne({
      where: {
        interface: req.body.interface,
      },
    })
    .then((data) => {
      if (data) {
        let datas = data.interface;
        if (datas !== "superadmin" && datas !== "admin") {
          db.admin
            .findAll({
              where: {
                interface: req.body.interface,
              },
            })
            .then((user) => {
              if (JSON.stringify(user.length) < 5) {
                db.admin
                  .findOne({
                    where: {
                      username: req.body.username,
                    },
                  })
                  .then((con) => {
                    if (!con) {
                      bcrypt.hash(req.body.password, 10, (err, hash) => {
                        userData.password = hash;
                        db.admin
                          .create(userData)
                          .then((user) => {
                            res.send(
                              user.username + " " + "Registered successfully"
                            );
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
              } else {
                res.send("User already exist");
              }
            })
            .catch((err) => {
              res.send(err.message);
            });
        } else {
          res.send("User already exist");
        }
      } else {
        if (
          req.body.interface === "admin" ||
          req.body.interface === "superadmin" ||
          req.body.interface === "editor"
        ) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash;
            db.admin
              .create(userData)
              .then((user) => {
                res.send(user.username + " " + "Registered successfully");
              })
              .catch((err) => {
                res.send(err.message);
              });
          });
        } else {
          res.send("User already exist");
        }
      }
    })
    .catch((err) => {
      res.send(err.message);
    });
});

router.post("/logins", async (req, res) => {
  await db.admin
    .findOne({
      where: {
        username: req.body.username,
      },
    })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.id, process.env.SECRET_KEYS);
          res.send({
            interface: user.interface,
            token,
          });
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

router.get("/getAllEditor", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.admin
        .findAll({
          where: {
            interface: "editor",
          },
        })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => res.send(err.message));
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Give proper files to upload");
  },
}).single("image");

module.exports = router;
