// const mongoose = require("mongoose");

// const CanvasMatrix = mongoose.Schema(
//   {
//     canvasMatrix: [[{ user: String}]]
//   }
// );

// module.exports = mongoose.model("CanvasMatrix", CanvasMatrix);

const mongoose = require("mongoose");
const MatrixElementSchema = mongoose.Schema({
  value: Number,
});
const CanvasMatrix = mongoose.Schema(
  {
    canvasMatrix: [[MatrixElementSchema]],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("CanvasMatrix", CanvasMatrix);