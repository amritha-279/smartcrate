require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const harvestRoutes = require('./routes/harvests');
const sensorRoutes = require('./routes/sensors');
const predictionRoutes = require('./routes/predictions');
const marketRoutes = require('./routes/markets');
const recommendationRoutes = require('./routes/recommendations');
const notificationRoutes = require('./routes/notifications');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SmartCrate backend running on port ${PORT} [${process.env.NODE_ENV}]`);
});
