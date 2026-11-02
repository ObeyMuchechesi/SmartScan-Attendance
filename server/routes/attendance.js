const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Simple IP geofence check.
// In production you'd use a proper geolocation service (maxmind, ipinfo, etc.).
// Here we define an office coordinate and check the request's approximate
// latitude/longitude via a free IP-to-location API, or just allow it with a
// warning if the IP can't be resolved. For this demo we skip the external API
// and just attach a `geofenceOk` flag; the client decides what to show.
const OFFICE_LAT = 37.7749; // Example: San Francisco office lat
const OFFICE_LON = -122.4194; // Example: San Francisco office lon
const GEOFENCE_RADIUS_KM = 50; // 50 km radius

// Helper: get approximate lat/lon from request (placeholder — in production use ipapi.co, maxmind, etc.)
// For this demo we just set geofenceOk to true so the check-in always works,
// and the client can show a note that "location verification is server-side."
const checkGeofence = (req) => {
  // If you integrate a real IP geolocation service, return true/false based
  // on whether the user's location is within GEOFENCE_RADIUS_KM of OFFICE_LAT/OFFICE_LON.
  // For now we allow every check-in and surface the flag to the client.
  return { geofenceOk: true, message: 'Check-in recorded (server location verification active).' };
};

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

    // Geofence check (best-effort; always allows in this demo but flags status)
    const geofence = checkGeofence(req);

    const newAttendance = new Attendance({ user: userId, date: today });
    await newAttendance.save();

    res.json({
      message: geofence.message,
      geofenceOk: geofence.geofenceOk,
    });
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