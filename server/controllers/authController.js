const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
    res.json({ success: true, msg: 'IDENTITY_REGISTERED' });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'USERNAME_TAKEN' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, msg: 'INVALID_CREDENTIALS' });
  }
  
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
  res.json({ success: true, token, username: user.username });
};