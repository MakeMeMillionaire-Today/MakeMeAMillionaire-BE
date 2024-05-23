const User = require("../models/userModel");

const getUserCoin = async (username) => {
  let stringUser = username.username;
  const user = await User.findOne({ stringUser });
  return user ? user.coin : 0;
};

const updateUserCoin = async (username, newCoinValue) => {
  try {
    if (typeof newCoinValue !== 'number') {
      throw new Error('The currency value must be a number');
    }
    // Actualización atómica
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { coin: newCoinValue } },
      { new: true, useFindAndModify: false }
    );
    if (updatedUser) {
      return updatedUser.coin;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error updating user currency:', error);
    return null;
  }
};

module.exports = { getUserCoin, updateUserCoin };
