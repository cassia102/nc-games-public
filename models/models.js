const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

//GET
exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id
    `,
      [review_id]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${review_id}`,
        });
      }
      return rows;
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY created_at DESC
    `
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${review_id}`,
        });
      }
      return rows;
    });
};

//PATCH
exports.updatedReviewsById = (review_id, inc_votes) => {
  let queryValue = reviews[review_id - 1].votes;
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: `Missing or incorrect fields required in body`,
    });
  } else if (inc_votes > 0) {
    queryValue += inc_votes;
  } else if (inc_votes < 0) {
    queryValue += inc_votes;
  }
  return db
    .query(`UPDATE reviews SET votes=$2 WHERE review_id=$1 RETURNING*;`, [
      review_id,
      queryValue,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
};
