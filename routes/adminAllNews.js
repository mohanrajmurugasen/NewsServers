const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db = require("../models");
const valid = require("../authenication/valid");
const multer = require("multer");
const path = require("path");

router.use(cors());

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

router.post("/addAllNews", valid, upload, async (req, res) => {
  const allData = {
    title: req.body.title,
    summary: req.body.summary,
    description: req.body.description,
    category: req.body.category,
    speciality: req.body.speciality,
    reporter: req.body.reporter,
    video: req.body.video,
    image: req.file.path,
    publish: req.body.publish,
    breaking: req.body.breaking,
  };
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await db.allNews
        .findOne({
          where: {
            title: req.body.title,
          },
        })
        .then(async (user) => {
          if (!user) {
            await db.allNews
              .create(allData)
              .then((news) => {
                res.send(`Hi ${news.reporter} your news posted successfully`);
              })
              .catch((err) => res.send(err.message));
          } else {
            res.send("News already exist");
          }
        });
    }
  });
});

router.get("/getAllNews", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      db.allNews
        .findAll()
        .then((user) => {
          res.send(user);
        })
        .catch((err) => res.send(err.message));
    }
  });
});

router.delete("/deleteAllNews/:id", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      db.allNews
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then((user) => {
          res.send("Deleted Successfully");
        })
        .catch((err) => res.send(err.message));
    }
  });
});

router.get("/getAllNewsById/:id", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      db.allNews
        .findOne({
          where: {
            id: req.params.id,
          },
        })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => res.send(err.message));
    }
  });
});

router.put("/updateAllNews/:id", valid, upload, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      db.allNews
        .update(
          {
            title: req.body.title,
            summary: req.body.summary,
            description: req.body.description,
            category: req.body.category,
            speciality: req.body.speciality,
            reporter: req.body.reporter,
            video: req.body.video,
            image: req.file.path,
            publish: req.body.publish,
            breaking: req.body.breaking,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        )
        .then((user) => {
          res.send("Updated Successfully");
        })
        .catch((err) => res.send(err.message));
    }
  });
});

router.put("/updateAllNewsPublish/:id", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      db.allNews
        .update(
          {
            publish: req.body.publish,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        )
        .then((user) => {
          res.send("Updated Successfully");
        })
        .catch((err) => res.send(err.message));
    }
  });
});

router.put("/updateAllNewsBreaking/:id", valid, async (req, res) => {
  jwt.verify(req.token, "admin", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      db.allNews
        .update(
          {
            breaking: req.body.breaking,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        )
        .then((user) => {
          res.send("Updated Successfully");
        })
        .catch((err) => res.send(err.message));
    }
  });
});

module.exports = router;