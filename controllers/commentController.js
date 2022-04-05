const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.comment_listPostComments_get = (req, res, next) => {
  Comment.find().exec(function (err, comments_list) {
    if (err) {
      return next(err);
    }

    if (comments_list.length == 0) {
      return res.status(404).json({ message: "No comments found" });
    }
    return res.status(200).json(comments_list);
  });
};

exports.comment_create_post = [
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }),
  body("text", "Add text").trim().isLength({ min: 1 }),
  body("author", "Comment must have an author").trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
        data: req.body,
      });
      return;
    }

    const comment = new Comment({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
      post: req.params.postid,
    });

    comment.save(function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Comment added succesfuly", comment });
    });
  },
];

exports.comment_edit_post = [
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }),
  body("text", "Add text").trim().isLength({ min: 1 }),
  body("author", "Comment must have an author").trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);

    const editedComment = new Comment({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
      post: req.params.postid,
      _id: req.params.id,
      date: Date.now,
    });

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array(), comment: editedComment });
    } else {
      Comment.findByIdAndUpdate(
        req.params.id,
        editedComment,
        {},
        function (err) {
          if (err) {
            return next(err);
          }
          res.json({ message: "Comment successfuly updated!", editedComment });
        }
      );
    }
  },
];

exports.comment_remove_post = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.id, function (err, comment) {
    if (err) {
      return next(err);
    }
    res.json({ message: "comment deleted!", comment });
  });
};
