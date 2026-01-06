const prisma = require('../services/db.js');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// POST /api/payments
// Body: { bookingId, method }
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({
        error: 'bookingId dan method wajib diisi'
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'PAID') {
      return res.status(400).json({ error: 'Booking sudah dibayar' });
    }

    // Simulasi proses pembayaran (delay 3 detik)
    await sleep(3000);

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        method,
        paidAmount: booking.totalPrice
      }
    });

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'PAID' }
    });

    return res.json({
      message: 'Payment successful (simulated)',
      booking: updatedBooking,
      payment
    });
  } catch (err) {
    console.error('createPayment error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/payments/:id
exports.getPayment = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        booking: true
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    return res.json(payment);
  } catch (err) {
    console.error('getPayment error:', err);
    res.status(500).json({ error: err.message });
  }
};
