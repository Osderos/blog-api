const Author = require("../models/author");

exports.author_list = (req, res, next) => {
  Author.find()
    .sort({ username: 1 })
    .exec(function (err, list_authors) {
      if (err) {
        return next(err);
      }
      res.json(list_authors);
    });
};

exports.author_create_post = (req, res, next) => {
  res.send("not implemented");
};

exports.author_update_post = (req, res, next) => {
  res.send("not implemented");
};

exports.author_remove_post = (req, res, next) => {
  res.send("not implemented");
};
