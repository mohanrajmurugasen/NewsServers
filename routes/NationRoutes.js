const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

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

router.post("/addNation", upload, async (req, res) => {
  const info = {
    image: req.file.path,
    heading: req.body.heading,
    author: req.body.author,
    description: req.body.description,
    video: req.body.video,
    content: req.body.content,
  };
  await db.adminNation
    .create(info)
    .then((user) => {
      res.send("Insert successfully");
    })
    .catch((err) => {
      res.send(err.message);
    });
});

router.post("/getAllNation", (req, res) => {
  db.adminNation.findAll().then((data) => res.send(data));
});

router.post("/getOneNation/:id", (req, res) => {
  db.adminNation
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((data) => res.send(data));
});

router.post("/removeNation/:id", (req, res) => {
  db.adminNation
    .destroy({
      where: {
        id: req.params.id,
      },
    })
    .then(() => {
      res.send("Deleted...");
    });
});

module.exports = router;
