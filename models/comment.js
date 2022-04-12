const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  titleComment: { type: String, required: true },
  textComment: { type: String, required: true },
  authorComment: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  postComment: { type: Schema.Types.ObjectId, ref:"Post" ,required:true}
});

module.exports = mongoose.model("Comment", CommentSchema);
