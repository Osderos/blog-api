const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  date: { type: Date, default: Date.now, required: true },
  isPublished: { type: Boolean, default: false, required: true },
});

module.exports = mongoose.model("Post", PostSchema);
