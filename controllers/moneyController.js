const User = require("../models/userModel");

const getUserCoin = async (username) => {
  let stringUser = username.username;
  const user = await User.findOne({ stringUser });
  return user ? user.coin : 0;
};

const updateUserCoin = async (username, newCoinValue) => {
  const user = await User.findOne({ username });
  if (user) {
    user.coin = newCoinValue;
    await user.save();
    return user.coin;
  }
  return null;
};

module.exports = { getUserCoin, updateUserCoin };
