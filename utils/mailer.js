const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendOtpEmail(to, otp) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.`,
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP email sent to ${to}`);
  } catch (err) {
    console.error('SendGrid error:', err);
  }
}

module.exports = { generateOtp, sendOtpEmail };
