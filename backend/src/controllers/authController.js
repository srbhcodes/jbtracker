const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/token");

const toPublicUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  username: user.username,
  email: user.email,
});

const register = async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const exists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });
  if (exists) {
    return res.status(400).json({ message: "Email or username already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullName: fullName.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password: hashed,
  });

  const token = signToken(user._id);
  res.status(201).json({ token, user: toPublicUser(user) });
};

const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: "Please provide credentials" });
  }

  const key = String(emailOrUsername).trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: key }, { username: key }],
  }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user._id);
  user.password = undefined;
  res.status(200).json({ token, user: toPublicUser(user) });
};

const getMe = async (req, res) => {
  res.status(200).json({ user: toPublicUser(req.user) });
};

module.exports = { register, login, getMe };
