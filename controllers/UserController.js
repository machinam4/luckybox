// controllers/userController.js
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    // const { username, email, password } = req.body;

    // const user = new User({
    //   username,
    //   email,
    //   password,
    // });

    // await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};
