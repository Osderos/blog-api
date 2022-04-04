var express = require("express");
var router = express.Router();
const passport = require("passport");

const author_controller = require("../controllers/authorController");
const message_controller = require("../controllers/messageController");
const post_controller = require("../controllers/postController");

//Author routes
router.get("/authors", author_controller.author_list);
router.post("/author/signup", author_controller.author_signup_post);
router.post("/author/login", author_controller.author_login_post);
router.post("/author/logout", author_controller.author_logout_get);
router.post(
  "/authors/:id",
  passport.authenticate("jwt", { session: false }),
  author_controller.author_update_post
);
router.delete(
  "/authors/:id",
  passport.authenticate("jwt", { session: false }),
  author_controller.author_remove_post
);

//Post routes
router.get("/posts", post_controller.post_listall_get);
router.get("/post/:id", post_controller.post_getpost_get);
router.post("/post/create", post_controller.post_create_post);
router.post("/post/:id", post_controller.post_edit_post);
router.delete("/post/:id", post_controller.post_delete);

module.exports = router;
