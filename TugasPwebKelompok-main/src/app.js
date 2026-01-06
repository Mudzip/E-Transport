const express = require('express');
const cors = require('cors');

const stationRoutes = require('./routes/stationRoutes.js');
const scheduleRoutes = require('./routes/scheduleRoutes.js'); 
const trainRoutes = require('./routes/trainRoutes.js');
const favoriteRoutes = require('./routes/favoriteRoutes.js');
const historyRoutes = require('./routes/historyRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const { injectUser } = require('./middlewares/userMiddleware');


const app = express();
app.use(cors());
app.use(express.json());
app.use(injectUser);

app.use('/api/stations', stationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);



app.get('/', (req, res) => {
  res.json({ message: "API E-Transport Running!" });
});

module.exports = app;
