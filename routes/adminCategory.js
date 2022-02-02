const express = require("express");
const router = express.Router();
const db = require("../models");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const valid = require("../authenication/valid");
const axios = require("axios");

router.use(cors());

router.post("/addCategory", valid, async (req, res) => {
  const userData = {
    name: req.body.name,
  };
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.category
        .findOne({
          where: {
            name: req.body.name,
          },
        })
        .then((data) => {
          if (!data) {
            db.category
              .create(userData)
              .then(async (user) => {
                res.send(user.name + " " + "Added Succesfully");
                await axios.post(
                  `https://app.nativenotify.com/api/indie/notification`,
                  {
                    subID: `2`,
                    appId: 1074,
                    appToken: "IESJ4vJMKa0qwwwqbSgT0z",
                    title: `Taiping News`,
                    message: `${user.name} category was added in your Application`,
                    pushData: { screenName: "TaipingNews" },
                  }
                );
              })
              .catch((err) => {
                res.send(err.message);
              });
          } else {
            res.send("This field is already added");
          }
        })
        .catch((err) => {
          res.send(err.message);
        });
    }
  });
});

router.get("/allCategory", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.category
        .findAll()
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          res.send(err.message);
        });
    }
  });
});

router.delete("/deleteCategory/:id", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const user = await db.category.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.send("Deleted Successfully");
    }
  });
});

router.put("/updateCategory/:id", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.category
        .update(
          { name: req.body.name },
          {
            where: {
              id: req.params.id,
            },
          }
        )
        .then((user) => {
          res.send("Updated");
        });
    }
  });
});

module.exports = router;
