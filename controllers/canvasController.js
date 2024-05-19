const CanvasElement = require("../models/canvasElement");
const { MAX_SIZE } = require("../consts/matrix");

const _ = require("lodash");

const initMatrix = () => {
  const matrix = [];
  for (let i = 0; i < MAX_SIZE; i++) {
    const row = new Array(MAX_SIZE);
    matrix.push(row);
  }
  return matrix;
};

const getCanvas = async () => {
  const matrix = initMatrix();
  const elements = await CanvasElement.find({});
  elements.forEach(({ _doc }) => {
    const { y, x, ...rest } = _doc;
    matrix[y][x] = rest;
  });
  return matrix;
};

const updateMatrix = async ({ x, y, image, userName, email }) => {
  const existElement = await CanvasElement.find({ x, y });
  if (!existElement.length) {
    await CanvasElement.create({
      x,
      y,
      image,
      userName,
      email,
    });
  }
};

module.exports = { initMatrix, updateMatrix, getCanvas };
