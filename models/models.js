const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
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
