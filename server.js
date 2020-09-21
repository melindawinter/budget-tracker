const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

// Local host port for express
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Set up MONGODB connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/budget-tracker",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// Routes
app.use(require("./routes/api.js"));

app.listen(PORT, HOST, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});
