const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2hr' })
};

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body


  try {
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ username, email, password: hashedPassword })

    res.status(201).json({ message: 'Register Successful' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body


  try {
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({ token: generateToken(user.username),message:"Login Successful" })
    } else {
      res.status(400).json({ message: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
});

// Reset Password
router.post('/resetpassword', async (req, res) => {
  const { email, newPassword } = req.body


  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' })

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
})

module.exports = router
