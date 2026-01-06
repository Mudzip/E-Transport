const prisma = require('../services/db.js');

exports.getSchedules = async (req, res) => {
  try {
    const { origin, destination, class: classFilter, sort } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: "origin & destination required" });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        departureStation: { code: origin.toUpperCase() },
        arrivalStation: { code: destination.toUpperCase() }
      },
      include: {
        train: {
          include: { classes: true }
        },
        departureStation: true,
        arrivalStation: true
      }
    });

    let results = schedules.map(sch => {
      const minClassPrice =
        sch.train.classes.length > 0
          ? Math.min(...sch.train.classes.map(c => c.price))
          : 0;

      return {
        id: sch.id,
        departureTime: sch.departureTime,
        arrivalTime: sch.arrivalTime,
        train: {
          id: sch.train.id,
          name: sch.train.name,
          trainType: sch.train.trainType,
          lowestPrice: minClassPrice
        },
        departureStation: sch.departureStation,
        arrivalStation: sch.arrivalStation
      };
    });

    if (classFilter) {
      results = results.filter(item =>
        schedules
          .find(s => s.id === item.id)
          .train.classes.some(c => c.className === classFilter)
      );
    }

    if (sort === "price_asc") {
      results.sort((a, b) => a.train.lowestPrice - b.train.lowestPrice);
    }

    if (sort === "price_desc") {
      results.sort((a, b) => b.train.lowestPrice - a.train.lowestPrice);
    }

    if (sort === "time_asc") {
      results.sort((a, b) =>
        new Date(a.departureTime) - new Date(b.departureTime)
      );
    }

    if (sort === "time_desc") {
      results.sort((a, b) =>
        new Date(b.departureTime) - new Date(a.departureTime)
      );
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
