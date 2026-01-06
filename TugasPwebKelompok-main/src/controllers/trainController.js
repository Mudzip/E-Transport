const prisma = require('../services/db.js');

// Color code per jalur KRL (standar PT KCI)
const lineColors = {
  "KRL Bogor Line": "#D50000",          // Red Line
  "KRL Cikarang Line": "#2947A9",       // Blue Line
  "KRL Rangkasbitung Line": "#00863D",  // Green Line
  "KRL Tangerang Line": "#8B4513",      // Brown Line
};

exports.getTrainDetail = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const train = await prisma.train.findUnique({
      where: { id },
      include: {
        classes: true,
        routeStops: {
          include: { station: true },
          orderBy: { stopOrder: 'asc' }
        }
      }
    });

    if (!train) {
      return res.status(404).json({ error: 'Train not found' });
    }

    const result = {
      id: train.id,
      name: train.name,
      trainType: train.trainType,
      lineColor: lineColors[train.name] || "#999999",
      classes: train.classes,
      route: train.routeStops.map(rs => ({
        order: rs.stopOrder,
        code: rs.station.code,
        name: rs.station.name,
        city: rs.station.city,
      }))
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
