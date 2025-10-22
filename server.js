require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const resetRoutes = require('./routes/resetRoutes');

const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/password', resetRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
