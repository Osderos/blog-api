var express = require("express");
var router = express.Router();

const author_controller = require("../controllers/authorController");
const message_controller = require("../controllers/messageController");
const post_controller = require("../controllers/postController");

//Author routes
router.get("/authors", author_controller.author_list);
router.post("/authors", author_controller.author_create_post);
router.put("/authors", author_controller.author_update_post);
router.delete("/authors", author_controller.author_remove_post);

module.exports = router;
