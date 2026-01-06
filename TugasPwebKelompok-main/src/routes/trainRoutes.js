const express = require('express');
const prisma = require('../services/db.js');
const { getTrainDetail } = require('../controllers/trainController.js');
const router = express.Router();

// Nama jalur → nama resmi kereta
const lineAlias = {
  bogor: "KRL Bogor Line",
  cikarang: "KRL Cikarang Line",
  rangkas: "KRL Rangkasbitung Line",
  tangerang: "KRL Tangerang Line"
};

router.get('/line/:alias', async (req, res) => {
  const alias = req.params.alias.toLowerCase();
  const name = lineAlias[alias];

  if (!name) return res.status(400).json({ error: "Line not found" });

  const train = await prisma.train.findFirst({
    where: { name },
    select: { id: true }
  });

  if (!train) return res.status(404).json({ error: "Train not found" });

  req.params.id = train.id; // arahkan ke controller detail
  return getTrainDetail(req, res);
});

// endpoint sebelumnya tetap
router.get('/', async (req, res) => {
  const { type } = req.query;
  const filter = type ? { trainType: type } : {};
  const trains = await prisma.train.findMany({ where: filter });
  res.json(trains);
});

router.get('/:id', getTrainDetail);
module.exports = router;
