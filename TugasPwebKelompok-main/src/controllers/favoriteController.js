const prisma = require('../services/db.js');

exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const favorites = await prisma.favoriteRoute.findMany({
      where: { userId },
      include: {
        origin: true,
        destination: true
      }
    });

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { userId, originCode, destinationCode } = req.body;

    if (!userId || !originCode || !destinationCode) {
      return res.status(400).json({ error: "userId, originCode, destinationCode are required" });
    }

    const origin = await prisma.station.findUnique({ where: { code: originCode } });
    const destination = await prisma.station.findUnique({ where: { code: destinationCode } });

    if (!origin || !destination) {
      return res.status(404).json({ error: "Station not found" });
    }

    const newFav = await prisma.favoriteRoute.create({
      data: {
        userId,
        originStationId: origin.id,
        destinationStationId: destination.id
      }
    });

    res.json({ message: "Favorite added", data: newFav });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFavorite = async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    const result = await prisma.favoriteRoute.delete({
      where: { id }
    });

    res.json({ message: "Favorite deleted", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
