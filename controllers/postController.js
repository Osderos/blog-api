const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

exports.post_listall_get = (req, res, next) => {
  Post.find().exec(function (err, posts_list) {
    if (err) {
      return next(err);
    }
    res.status(200).json(posts_list);
  });
};

exports.post_getpost_get = (req, res, next) => {
  res.send("not implemented");
};

exports.post_create_post = (req, res, next) => {
  res.send("not implemented");
};

exports.post_delete = (req, res, next) => {
  res.send("not implemented");
};

exports.post_edit_post = (req, rest, next) => {
  res.send("not implemented");
};
