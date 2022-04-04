const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const Author = require("../models/author");

require("dotenv").config();

exports.author_list = (req, res, next) => {
  Author.find()
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

exports.author_update_post = (req, res, next) => {
  res.send("not implemented");
};

exports.author_remove_post = (req, res, next) => {
  res.send("not implemented");
};
