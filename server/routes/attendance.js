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

    const existing = await Attendance.findOne({ user: userId, date: today });
    if (existing) {
      return res.status(400).json({ message: 'You have already checked in today.' });
    }

    const newAttendance = new Attendance({ user: userId, date: today });
    await newAttendance.save();

    res.json({ message: 'Check-in Successful! Good Morning!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/attendance/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'No user identified. Please log in first.' });
    }

    const today = new Date().toISOString().split('T')[0];
    let record = await Attendance.findOne({ user: userId, date: today });

    if (!record) {
      return res.status(400).json({ message: 'No check-in record found for today.' });
    }

    record.checkoutTime = new Date();
    await record.save();

    res.json({ message: 'Check-out recorded successfully', checkoutTime: record.checkoutTime });
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

// @route GET /api/attendance/export-csv
router.get('/export-csv', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = await Attendance.find({ date: today }).populate('user', 'name email');

    // Generate CSV
    let csv = 'Name,Check-in Time,Check-out Time\n';
    records.forEach(record => {
      const name = record.user ? record.user.name : 'Unknown';
      const checkIn = record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A';
      const checkOut = record.checkoutTime ? new Date(record.checkoutTime).toLocaleTimeString() : '—';
      csv += `"${name}",${checkIn},${checkOut}\n`;
    });

    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', `attachment; filename="SmartScan-Attendance-${today}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;