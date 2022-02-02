const express = require("express");
const router = express.Router();
const db = require("../models");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const valid = require("../authenication/valid");
const axios = require("axios");

router.use(cors());

router.post("/addNotification", valid, async (req, res) => {
  const userData = {
    title: req.body.title,
    message: req.body.message,
  };
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.notification
        .create(userData)
        .then(async (user) => {
          res.send(user);
          await axios.post(
            `https://app.nativenotify.com/api/indie/notification`,
            {
              subID: `2`,
              appId: 1074,
              appToken: "IESJ4vJMKa0qwwwqbSgT0z",
              title: `${user.title}`,
              message: `${user.message}`,
              pushData: { screenName: "TaipingNews" },
            }
          );
        })
        .catch((err) => {
          res.send(err.message);
        });
    }
  });
});

router.get("/oneNotification", async (req, res) => {
  await db.notification
    .findOne({
      order: [["id", "DESC"]],
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err.message);
    });
});

module.exports = router;
