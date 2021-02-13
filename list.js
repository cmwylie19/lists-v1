const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const List = new Schema({
  title: String,
  owner: String,
  allow: { type: Array, default: [] },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("List", List);
