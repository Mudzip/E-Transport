const prisma = require('../services/db.js');

const getAllStations = async (req, res) => {
  try {
    const stations = await prisma.station.findMany();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchStations = async (req, res) => {
  try {
    const { q } = req.query;
    const stations = await prisma.station.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' }},
          { city: { contains: q, mode: 'insensitive' }},
          { code: { contains: q, mode: 'insensitive' }},
        ]
      }
    });
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllStations,
  searchStations
};
