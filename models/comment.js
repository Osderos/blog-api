const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  post: { type:Schema.Types.ObjectId, ref:"Post", required:true}
});

module.exports = mongoose.model("Comment", CommentSchema);
