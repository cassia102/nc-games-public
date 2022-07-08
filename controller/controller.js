const reviews = require("../db/data/test-data/reviews");
const {
  fetchCategories,
  fetchReviewById,
  updatedReviewsById,
  fetchUsers,
  fetchReviews,
  fetchReviewComments,
  sendComment,
} = require("../models/models");

//GET
exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { category } = req.query;
  fetchReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

//PATCH
exports.patchReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updatedReviewsById(review_id, inc_votes)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

//POST
exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const newComment = req.body;
  sendComment(review_id, newComment)
    .then((comments) => {
      res.status(201).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
