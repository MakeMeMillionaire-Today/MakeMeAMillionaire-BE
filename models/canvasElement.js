const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { MAX_SIZE } = require("../consts/matrix");

const canvasElement = new mongoose.Schema({
  y: {
    type: Number,
    min: 0,
    max: MAX_SIZE,
    require: true,
  },
  x: {
    type: Number,
    min: 0,
    max: MAX_SIZE,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    //required: true,
  },
  image: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("CanvasElement", canvasElement);
