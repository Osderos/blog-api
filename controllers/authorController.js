const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Author = require("../models/author");

require("dotenv").config();

exports.author_list = (req, res, next) => {
  Author.find()
    .select({ password: 0 })
    .sort({ username: 1 })
    .exec(function (err, list_authors) {
      if (err) {
        return next(err);
      }
      res.status(200).json(list_authors);
    });
};

exports.author_signup_post = [
  body("username", "Please enter a username")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be min 3 chars.").trim().isLength({ min: 3 }),
  body("passwordConfirm").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Password confirmation does not match the password.");
    }
    return true;
  }),
  async (req, res, next) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }
      Author.findOne({ username: req.body.username }).exec(async function (
        err,
        found_username
      ) {
        if (err) {
          return err;
        }
        if (found_username) {
          res.json({ error: "Username already in use." });
        } else {
          const hash = await bcrypt.hash(req.body.password, 10);
          const author = new Author({
            username: req.body.username,
            password: hash,
          });
          author.save(function (err) {
            if (err) {
              return res.status(500).json({ error: "Upload to db failed" });
            }
            return res.status(200).json({
              author: { _id: author._id, username: author.username },
              message: "Signup successful",
            });
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
];

exports.author_login_post = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, author, info) => {
    if (err || !author) {
      return res.status(400).json({
        message: "Something is not right.",
        author: author,
      });
    }
    req.login(author, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(author.toJSON(), process.env.TOKEN_SECRET, {
        expiresIn: "300s",
      });
      return res.json({ author, token });
    });
  })(req, res);
};

exports.author_logout_get = (req, res) => {
  req.logout();
  res.json({
    status: "logout",
    msg: "Please Log In again",
  });
};

exports.author_update_post = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter a new username")
    .escape(),
  body("password", "Password must be min 3 chars.").trim().isLength({ min: 3 }),
  body("passwordConfirm").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Password confirmation does not match the password.");
    }
    return true;
  }),
  async (req, res, next) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }
      Author.findOne({ username: req.body.username }).exec(async function (
        err,
        found_user
      ) {
        if (err) {
          return next(err);
        }
        if (found_user) {
          res.json({ error: "Username already exists!" });
        } else {
          const hash = await bcrypt.hash(req.body.password, 10);
          const newAuthor = new Author({
            username: req.body.username,
            password: hash,
            _id: req.params.id,
          });

          Author.findByIdAndUpdate(
            req.params.id,
            newAuthor,
            {},
            function (err) {
              if (err) {
                return res.json(err);
              }
              res.json({ message: "Author succesfully updated" });
            }
          );
        }
      });
    } catch (err) {
      res.json(err);
    }
  },
];

exports.author_remove_post = (req, res, next) => {
  Author.findByIdAndRemove({ _id: req.params.id }, function (err, author) {
    if (err) {
      return next(err);
    }
    res.json({ author, message: "Author has been deleted" });
  });
};
