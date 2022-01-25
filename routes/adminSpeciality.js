const express = require("express");
const router = express.Router();
const db = require("../models");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const valid = require("../authenication/valid");

router.use(cors());

router.post("/addSpeciality", valid, async (req, res) => {
  const userData = {
    name: req.body.name,
  };
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      db.speciality
        .findOne({
          where: {
            name: req.body.name,
          },
        })
        .then((data) => {
          if (!data) {
            db.speciality
              .create(userData)
              .then((user) => {
                res.send(user);
              })
              .catch((err) => {
                res.send(err.message);
              });
          } else {
            res.send("This speciality already added");
          }
        });
    }
  });
});

router.get("/allSpeciality", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.speciality
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

router.delete("/deleteSpeciality/:id", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const user = await db.speciality.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.send("Deleted Successfully");
    }
  });
});

router.put("/updateSpeciality/:id", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.speciality
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
