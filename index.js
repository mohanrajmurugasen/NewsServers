require("dotenv").config();
const express = require("express");
const swaggerDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const PORT = process.env.PORT || 8000;
const apiRoutes = require("./routes/apiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminCategory = require("./routes/adminCategory");
const adminSpeciality = require("./routes/adminSpeciality");
const adminAllNews = require("./routes/adminAllNews");
const notification = require("./routes/notification");

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple swagger express",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*js"],
};
const swaggerDocs = swaggerDoc(option);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/", apiRoutes);
app.use("/", adminRoutes);
app.use("/", adminCategory);
app.use("/", adminSpeciality);
app.use("/", adminAllNews);
app.use("/", notification);

app.use("/images", express.static("./images"));

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
