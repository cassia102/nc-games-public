const express = require("express");
const { getCategories } = require("./controller/controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
