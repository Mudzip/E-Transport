const prisma = require('../services/db.js');

exports.getSchedules = async (req, res) => {
  try {
    const { origin, destination, class: classFilter, sort } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: "origin & destination required" });
    }

    // 1. Find stations by code
    const originStation = await prisma.station.findUnique({ where: { code: origin.toUpperCase() } });
    const destStation = await prisma.station.findUnique({ where: { code: destination.toUpperCase() } });

    if (!originStation || !destStation) {
      return res.status(404).json({ error: "Station not found" });
    }

    // 2. Find trains that go through BOTH stations
    // We look for trains that have a RouteStop at Origin AND a RouteStop at Destination
    const routeStops = await prisma.routeStop.findMany({
      where: {
        train: {
          routeStops: {
            some: { stationId: destStation.id }
          }
        },
        stationId: originStation.id
      },
      include: {
        train: {
          include: {
            classes: true,
            routeStops: {
              where: {
                stationId: { in: [originStation.id, destStation.id] }
              }
            }
          }
        }
      }
    });

    // 3. Filter valid trains (Allow bidirectional)
    const validTrains = routeStops
      .filter(rs => {
        const originStop = rs.train.routeStops.find(s => s.stationId === originStation.id);
        const destStop = rs.train.routeStops.find(s => s.stationId === destStation.id);
        return originStop && destStop && originStop.stopOrder !== destStop.stopOrder;
      })
      .map(rs => {
        const originStop = rs.train.routeStops.find(s => s.stationId === originStation.id);
        const destStop = rs.train.routeStops.find(s => s.stationId === destStation.id);
        const isNormalDirection = originStop.stopOrder < destStop.stopOrder;
        return {
          ...rs.train,
          stopsDiff: Math.abs(destStop.stopOrder - originStop.stopOrder),
          originStop,
          destStop,
          isNormalDirection
        };
      });

    const validTrainIds = validTrains.map(t => t.id);

    if (validTrainIds.length === 0) {
      return res.json([]);
    }

    // 4. Fetch schedules for these trains
    // We don't filter by departureStationId/arrivalStationId here because the schedule
    // is defined by the full route (e.g. BOO -> JAKK).
    // We assume the schedule departs from stopOrder=1.
    const schedules = await prisma.schedule.findMany({
      where: {
        trainId: { in: validTrainIds }
      },
      include: {
        train: {
          include: { classes: true, routeStops: true }
        },
        departureStation: true,
        arrivalStation: true
      }
    });

    // 5. Filter Schedules Valid for the Direction & segment
    let results = schedules
      .filter(sch => {
        const trainMeta = validTrains.find(t => t.id === sch.trainId);
        if (!trainMeta) return false;

        const schStartStop = sch.train.routeStops.find(rs => rs.stationId === sch.departureStationId);
        const schEndStop = sch.train.routeStops.find(rs => rs.stationId === sch.arrivalStationId);

        if (!schStartStop || !schEndStop) return false;

        const schIsNormal = schStartStop.stopOrder < schEndStop.stopOrder;

        if (schIsNormal !== trainMeta.isNormalDirection) return false;

        if (schIsNormal) {
          return schStartStop.stopOrder <= trainMeta.originStop.stopOrder &&
            trainMeta.destStop.stopOrder <= schEndStop.stopOrder;
        } else {
          return schStartStop.stopOrder >= trainMeta.originStop.stopOrder &&
            trainMeta.destStop.stopOrder >= schEndStop.stopOrder;
        }
      })
      .map(sch => {
        const trainMeta = validTrains.find(t => t.id === sch.trainId);
        const schStartStop = sch.train.routeStops.find(rs => rs.stationId === sch.departureStationId);

        let minutesOffset = 0;
        if (schStartStop) {
          const stopsDifference = Math.abs(trainMeta.originStop.stopOrder - schStartStop.stopOrder);
          if (stopsDifference > 0) {
            minutesOffset = stopsDifference * 3;
          }
        }

        const estimatedDeparture = new Date(sch.departureTime);
        estimatedDeparture.setMinutes(estimatedDeparture.getMinutes() + minutesOffset);

        const estimatedArrival = new Date(estimatedDeparture);
        const durationMinutes = trainMeta.stopsDiff * 4;
        estimatedArrival.setMinutes(estimatedArrival.getMinutes() + durationMinutes);

        const minClassPrice =
          sch.train.classes.length > 0
            ? Math.min(...sch.train.classes.map(c => c.price))
            : 0;

        return {
          id: sch.id,
          departureTime: estimatedDeparture.toISOString(),
          arrivalTime: estimatedArrival.toISOString(),
          train: {
            id: sch.train.id,
            name: sch.train.name,
            trainType: sch.train.trainType,
            lowestPrice: minClassPrice
          },
          departureStation: originStation,
          arrivalStation: destStation
        };
      });

    // Filter out schedules that have already passed (optional, maybe not for today's debug)
    // results = results.filter(r => new Date(r.departureTime) > new Date());

    // Sort logic...

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
