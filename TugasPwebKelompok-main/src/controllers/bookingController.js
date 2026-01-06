const prisma = require('../services/db.js');

// POST /api/bookings
// Body: { userId, scheduleId, className }
exports.createBooking = async (req, res) => {
  try {
    const { userId, scheduleId, className } = req.body;

    if (!userId || !scheduleId || !className) {
      return res.status(400).json({
        error: 'userId, scheduleId, className required'
      });
    }

    // Ambil schedule + train + classes
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(scheduleId) },
      include: {
        train: {
          include: { classes: true }
        },
        departureStation: true,
        arrivalStation: true
      }
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Cegat KRL: tidak boleh booking
    if (schedule.train.trainType === 'KRL') {
      return res.status(400).json({
        error: 'KRL tidak perlu booking, cukup tap in/out di stasiun'
      });
    }

    // Validasi className (hanya untuk Intercity)
    const ticketClass = schedule.train.classes.find(
      (c) => c.className === className
    );

    if (!ticketClass) {
      return res.status(400).json({
        error: 'Class tidak tersedia untuk kereta ini'
      });
    }

    // Buat booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        scheduleId: schedule.id,
        className,
        totalPrice: ticketClass.price
      }
    });

    return res.json({
      message: 'Booking created',
      booking: {
        id: booking.id,
        userId: booking.userId,
        status: booking.status,
        totalPrice: booking.totalPrice,
        className: booking.className,
        createdAt: booking.createdAt,
        schedule: {
          id: schedule.id,
          trainName: schedule.train.name,
          trainType: schedule.train.trainType,
          departureStation: schedule.departureStation.name,
          arrivalStation: schedule.arrivalStation.name,
          departureTime: schedule.departureTime,
          arrivalTime: schedule.arrivalTime
        }
      }
    });
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        schedule: {
          include: {
            train: true,
            departureStation: true,
            arrivalStation: true
          }
        },
        payment: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json(booking);
  } catch (err) {
    console.error('getBooking error:', err);
    res.status(500).json({ error: err.message });
  }
};
