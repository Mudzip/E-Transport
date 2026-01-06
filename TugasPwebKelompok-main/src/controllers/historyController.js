const prisma = require('../services/db.js');

exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const history = await prisma.searchHistory.findMany({
      where: { userId },
      include: {
        origin: true,
        destination: true
      },
      orderBy: {
        searchDate: 'desc'
      }
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addHistory = async (req, res) => {
  try {
    const { userId, originCode, destinationCode } = req.body;

    if (!userId || !originCode || !destinationCode) {
      return res.status(400).json({ error: "userId, originCode, destinationCode required" });
    }

    const origin = await prisma.station.findUnique({ where: { code: originCode } });
    const destination = await prisma.station.findUnique({ where: { code: destinationCode } });

    if (!origin || !destination) {
      return res.status(404).json({ error: "Station not found" });
    }

    const newHistory = await prisma.searchHistory.create({
      data: {
        userId,
        originStationId: origin.id,
        destinationStationId: destination.id
      }
    });

    res.json({ message: "History added", data: newHistory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
