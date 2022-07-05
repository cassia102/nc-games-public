exports.handleInvalidPath = (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
};

exports.handleCustomError = (err, req, res, next) => {
  console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleInvalidInput = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Input" });
  } else {
    next(err);
  }
};

exports.handle500Error = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server error" });
};
