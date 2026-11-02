const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// @route POST /api/attendance/checkin
router.post('/checkin', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'No user identified. Please log in first.' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in
    const existing = await Attendance.findOne({ user: userId, date: today });
    if (existing) {
      return res.status(400).json({ message: 'You have already checked in today.' });
    }

    const newAttendance = new Attendance({ user: userId, date: today });
    await newAttendance.save();

    res.status(201).json({ message: 'Check-in Successful! Good Morning!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/attendance/today
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = await Attendance.find({ date: today }).populate('user', 'name email');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
