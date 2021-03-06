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

exports.fetchReviews = (sort_by = "created_at", order = "desc", category) => {
  const validSortOptions = [
    "created_at",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "votes",
  ];

  if (!validSortOptions.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort_by query",
    });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = "";
  let queryValues = [];

  return db
    .query(`SELECT * FROM categories WHERE categories.slug = $1`, [category])
    .then(({ rows }) => {
      if (rows.length === 0 && category !== undefined) {
        return Promise.reject({
          status: 404,
          msg: `No category found for: ${category}`,
        });
      } else if (category !== undefined) {
        queryStr += ` WHERE reviews.category = $1`;
        queryValues.push(category);
      }
    })
    .then(() => {
      return db.query(
        `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews 
        LEFT JOIN comments ON reviews.review_id = comments.review_id 
        ${queryStr} 
        GROUP BY reviews.review_id 
        ORDER BY ${sort_by} ${order}
      `,
        queryValues
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchReviewComments = (review_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comments.review_id = $1`, [review_id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return db
          .query(`SELECT * FROM reviews WHERE reviews.review_id = $1`, [
            review_id,
          ])
          .then(({ rows }) => {
            if (rows.length > 0) {
              return [];
            } else {
              return Promise.reject({
                status: 404,
                msg: `No comments found for review_id: ${review_id}`,
              });
            }
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

//POST
exports.sendComment = (review_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (author, body, review_id) VALUES ($2, $1, $3) RETURNING *;`,
      [body, username, review_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

//DELETE
exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING*", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found at ${comment_id}`,
        });
      }
    });
};
