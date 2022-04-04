var express = require("express");
var router = express.Router();
const passport = require("passport");

const author_controller = require("../controllers/authorController");
const message_controller = require("../controllers/messageController");
const post_controller = require("../controllers/postController");

// passport.authenticate("jwt", { session: false }),

//Author routes
router.get("/authors", author_controller.author_list);
router.post("/author/signup", author_controller.author_signup_post);
router.post("/author/login", author_controller.author_login_post);
router.post("/author/logout", author_controller.author_logout_get)
router.put("/authors", author_controller.author_update_post);
router.delete("/authors", author_controller.author_remove_post);

module.exports = router;
