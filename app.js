const express = require("express");
const { getCategories, getReviewById } = require("./controller/controller");
const {
  handleInvalidPath,
  handle500Error,
  handleCustomError,
  handleInvalidInput,
} = require("./controller/controller.errors");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

//ERROR HANDLERS
app.all("*", handleInvalidPath);
app.use(handleCustomError);
app.use(handleInvalidInput);
app.use(handle500Error);

module.exports = app;
