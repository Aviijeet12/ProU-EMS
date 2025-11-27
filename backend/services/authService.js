const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.createUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  return await User.create({
    name,
    email,
    password: hashed,
    role: "user",
  });
};
