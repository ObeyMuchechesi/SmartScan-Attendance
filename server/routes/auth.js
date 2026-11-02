const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route POST /api/auth/login
// can receive either { email, password } or { badgeNumber }
router.post('/login', async (req, res) => {
  try {
    const { email, password, badgeNumber } = req.body;
    if (badgeNumber) {
      // Login by badge number
      const user = await User.findOne({ badgeNumber });
      if (!user) {
        return res.status(400).json({ message: 'Invalid badge number.' });
      }
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    if (email && password) {
      // Login by email/password (existing flow)
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    res.status(400).json({ message: 'Provide email+password or badgeNumber.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/register
// accepts { name, email, password, role, badgeNumber } — badgeNumber is saved if provided
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, badgeNumber } = req.body;

    // If registering with just badgeNumber and name (quick onboard, no email)
    if (badgeNumber && !email) {
      const existing = await User.findOne({ badgeNumber });
      if (existing) {
        return res.status(400).json({ message: 'Badge number already taken.' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = password ? await bcrypt.hash(password, salt) : 'temp';
      const user = await User.create({
        name,
        email: email || '',
        password: hashedPassword,
        role: role || 'employee',
        badgeNumber,
      });
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    // Full registration with email+password (badgeNumber is optional)
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      badgeNumber: badgeNumber || undefined, // save if provided
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;