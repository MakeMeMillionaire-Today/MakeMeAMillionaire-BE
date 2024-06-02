const User = require("../models/userModel");

module.exports.authUser = async (req, res, next) => {
  try {
    const { username, email, coin } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ username, email, coin });
    } else {
      const newUser = await User.create({
        username,
        email,
        coin,
      });
      return res.json({ status: true, newUser });
    }
  } catch (error) {
    next(error);
  }
};
module.exports.getUser = async (req, res, next) => {
  const username = decodeURIComponent(req.params.username);
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(300).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    next(error);
  }
};
module.exports.updateCoin = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { amount } = req.body;    
    if (typeof amount !== "number") {
      return res.status(400).json({ message: "Amount must be a number" });
    }
    const user = await User.findOneAndUpdate(
      { username },
      { coin: amount }, // Update the value of 'coin' directly
      { new: true } // Returns the updated document
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ status: true, coin: user.coin });
  } catch (error) {
    next(error);
  }
};
