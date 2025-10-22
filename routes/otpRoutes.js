const express = require('express');
const User = require('../models/User');
const { generateOtp, sendOtpEmail } = require('../utils/mailer');

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) user = new User({ email: email.toLowerCase() });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 5) * 60000);
    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    const user = await User.findOne({ email: email.toLowerCase(), otp });
    if (!user) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
