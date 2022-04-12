const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Author = require("../models/author");

exports.post_listall_get = (req, res, next) => {
  Post.find().exec(function (err, posts_list) {
    if (err) {
      return next(err);
    }
    res.status(200).json(posts_list);
  });
};

exports.post_getpost_get = (req, res, next) => {
  Post.findById(req.params.id).exec(function (err, post) {
    if (err) {
      return next(err);
    }
    res.status(200).json(post);
  });
};

exports.post_create_post = [
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }),
  body("text", "Add text").trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
      
    });

    if (!errors.isEmpty()) {
      Author.find().exec(function (err, results) {
        if (err) {
          return next(err);
        }
        res.json({ errors: errors.array(), authors: results, post: post });
      });
      return;
    } else {
      post.save(function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).json({ message: "Post successfuly created", post });
      });
    }
  },
];

exports.post_delete = (req, res, next) => {
  Post.findByIdAndRemove({ _id: req.params.id }, function (err, post) {
    if (err) {
      return next(err);
    }
    res.json({ post, message: "Post has been deleted" });
  });
};

exports.post_edit_post = [
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }),
  body("text", "Add text").trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);

    const editedPost = new Post({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
      isPublished: req.body.published,
      date: Date.now,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      Author.find().exec(function (err, results) {
        if (err) {
          return next(err);
        }
        res.json({
          errors: errors.array(),
          authors: results,
          post: editedPost,
        });
      });
      return;
    } else {
      Post.findByIdAndUpdate(req.params.id, editedPost, {}, function (err) {
        if (err) {
          return next(err);
        }
        res.json({ message: "Post succesfuly updated", post: editedPost });
      });
    }
  },
];

exports.post_publish = (req,res,next)=>{
  res.send('not implemented')
}

exports.post_unpublish = (req,res,next)=>{
  res.send('not implemented')
}
