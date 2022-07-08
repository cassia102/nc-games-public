const express = require("express");
const {
  getCategories,
  getReviewById,
  patchReviewVotes,
  getUsers,
  getReviews,
  getReviewComments,
  postComment,
  deleteComment,
  getEndpoints,
} = require("./controller/controller");
const {
  handleInvalidPath,
  handle500Error,
  handleCustomError,
  handleInvalidInput,
  handleInvalidInput2,
  handleInvalidInput3,
} = require("./controller/controller.errors");
const app = express();

app.use(express.json());

//GET
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getReviewComments);
app.get("/api", getEndpoints);

//PATCH
app.patch("/api/reviews/:review_id", patchReviewVotes);

//POST
app.post("/api/reviews/:review_id/comments", postComment);

//DELETE
app.delete("/api/comments/:comment_id", deleteComment);

//ERROR HANDLERS
app.all("*", handleInvalidPath);
app.use(handleCustomError);
app.use(handleInvalidInput);
app.use(handleInvalidInput2);
app.use(handleInvalidInput3);
app.use(handle500Error);

module.exports = app;
