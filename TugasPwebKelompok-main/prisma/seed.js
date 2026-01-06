const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hapus data lama (urutan penting karena relasi)
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.favoriteRoute.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.trainClass.deleteMany();
  await prisma.train.deleteMany();
  await prisma.station.deleteMany();

  // =========================
  // 1️⃣ STATIONS
  // =========================
  const stationsData = [
    // Intercity utama
    { code: 'BD',   name: 'Bandung',          city: 'Bandung',        stationType: 'Intercity' },
    { code: 'GMR',  name: 'Gambir',           city: 'Jakarta Pusat',  stationType: 'Intercity' },
    { code: 'PSE',  name: 'Pasar Senen',      city: 'Jakarta Pusat',  stationType: 'Intercity' },
    { code: 'CN',   name: 'Cirebon',          city: 'Cirebon',        stationType: 'Intercity' },
    { code: 'TGL',  name: 'Tegal',            city: 'Tegal',          stationType: 'Intercity' },
    { code: 'SMT',  name: 'Semarang Tawang',  city: 'Semarang',       stationType: 'Intercity' },
    { code: 'KTA',  name: 'Kutoarjo',         city: 'Kutoarjo',       stationType: 'Intercity' },
    { code: 'YK',   name: 'Yogyakarta',       city: 'Yogyakarta',     stationType: 'Intercity' },
    { code: 'SLO',  name: 'Solo Balapan',     city: 'Surakarta',      stationType: 'Intercity' },
    { code: 'SGU',  name: 'Surabaya Gubeng',  city: 'Surabaya',       stationType: 'Intercity' },
    { code: 'SBI',  name: 'Surabaya Pasar Turi', city: 'Surabaya',    stationType: 'Intercity' },

    // Stasiun shared Intercity + KRL
    { code: 'BKS',  name: 'Bekasi',           city: 'Bekasi',         stationType: 'Both' },
    { code: 'JNG',  name: 'Jatinegara',       city: 'Jakarta Timur',  stationType: 'Both' },
    { code: 'MRI',  name: 'Manggarai',        city: 'Jakarta Selatan',stationType: 'Both' },
    { code: 'TAB',  name: 'Tanah Abang',      city: 'Jakarta Pusat',  stationType: 'Both' },

    // KRL Bogor Line (disederhanakan)
    { code: 'BOO',  name: 'Bogor',            city: 'Bogor',          stationType: 'KRL' },
    { code: 'CLB',  name: 'Cilebut',          city: 'Bogor',          stationType: 'KRL' },
    { code: 'CTA',  name: 'Citayam',          city: 'Depok',          stationType: 'KRL' },
    { code: 'DP',   name: 'Depok',            city: 'Depok',          stationType: 'KRL' },
    { code: 'DPK',  name: 'Depok Baru',       city: 'Depok',          stationType: 'KRL' },
    { code: 'UI',   name: 'Universitas Indonesia', city: 'Depok',     stationType: 'KRL' },
    { code: 'POC',  name: 'Pondok Cina',      city: 'Depok',          stationType: 'KRL' },
    { code: 'LNA',  name: 'Lenteng Agung',    city: 'Jakarta Selatan',stationType: 'KRL' },
    { code: 'TJB',  name: 'Tanjung Barat',    city: 'Jakarta Selatan',stationType: 'KRL' },
    { code: 'PSM',  name: 'Pasar Minggu',     city: 'Jakarta Selatan',stationType: 'KRL' },
    { code: 'DUR',  name: 'Duren Kalibata',   city: 'Jakarta Selatan',stationType: 'KRL' },
    { code: 'CW',   name: 'Cawang',           city: 'Jakarta Timur',  stationType: 'KRL' },
    { code: 'TEB',  name: 'Tebet',            city: 'Jakarta Selatan',stationType: 'KRL' },
    { code: 'SUD',  name: 'Sudirman',         city: 'Jakarta Pusat',  stationType: 'KRL' },
    { code: 'JAKK', name: 'Jakarta Kota',     city: 'Jakarta Barat',  stationType: 'KRL' },
    { code: 'DUI',  name: 'Duri',             city: 'Jakarta Barat',  stationType: 'KRL' },
    { code: 'KPB',  name: 'Kampung Bandan',   city: 'Jakarta Utara',  stationType: 'KRL' },

    // KRL Cikarang Line (disederhanakan)
    { code: 'CKR',  name: 'Cikarang',         city: 'Bekasi',         stationType: 'KRL' },
    { code: 'TB',   name: 'Tambun',           city: 'Bekasi',         stationType: 'KRL' },
    { code: 'BKST', name: 'Bekasi Timur',     city: 'Bekasi',         stationType: 'KRL' },
    { code: 'KRI',  name: 'Kranji',           city: 'Bekasi',         stationType: 'KRL' },
    { code: 'CKI',  name: 'Cakung',           city: 'Jakarta Timur',  stationType: 'KRL' },
    { code: 'KLD',  name: 'Klender',          city: 'Jakarta Timur',  stationType: 'KRL' },

    // KRL Rangkasbitung Line (disederhanakan)
    { code: 'RKS',  name: 'Rangkasbitung',    city: 'Lebak',          stationType: 'KRL' },
    { code: 'MJA',  name: 'Maja',             city: 'Lebak',          stationType: 'KRL' },
    { code: 'TGS',  name: 'Tigaraksa',        city: 'Tangerang',      stationType: 'KRL' },
    { code: 'PRP',  name: 'Parung Panjang',   city: 'Bogor',          stationType: 'KRL' },
    { code: 'CSA',  name: 'Cisauk',           city: 'Tangerang',      stationType: 'KRL' },
    { code: 'SRP',  name: 'Serpong',          city: 'Tangerang',      stationType: 'KRL' },
    { code: 'RB',   name: 'Rawa Buntu',       city: 'Tangerang',      stationType: 'KRL' },
    { code: 'SMR',  name: 'Sudimara',         city: 'Tangerang',      stationType: 'KRL' },
    { code: 'POK',  name: 'Pondok Ranji',     city: 'Tangerang',      stationType: 'KRL' },
    { code: 'PLM',  name: 'Palmerah',         city: 'Jakarta Pusat',  stationType: 'KRL' },
    { code: 'KBY',  name: 'Kebayoran',        city: 'Jakarta Selatan',stationType: 'KRL' },

    // KRL Tangerang Line (disederhanakan)
    { code: 'TNG',  name: 'Tangerang',        city: 'Tangerang',      stationType: 'KRL' },
    { code: 'BTCP', name: 'Batu Ceper',       city: 'Tangerang',      stationType: 'KRL' },
    { code: 'POR',  name: 'Poris',            city: 'Tangerang',      stationType: 'KRL' },
    { code: 'RWB',  name: 'Rawa Buaya',       city: 'Jakarta Barat',  stationType: 'KRL' },
    { code: 'BJI',  name: 'Bojong Indah',     city: 'Jakarta Barat',  stationType: 'KRL' },
    { code: 'TMN',  name: 'Taman Kota',       city: 'Jakarta Barat',  stationType: 'KRL' },
    { code: 'PSI',  name: 'Pesing',           city: 'Jakarta Barat',  stationType: 'KRL' },
    { code: 'GRO',  name: 'Grogol',           city: 'Jakarta Barat',  stationType: 'KRL' },
  ];

  await prisma.station.createMany({ data: stationsData });
  const allStations = await prisma.station.findMany();
  const getStationId = (code) => {
    const st = allStations.find(s => s.code === code);
    if (!st) throw new Error('Station not found: ' + code);
    return st.id;
  };

  // =========================
  // 2️⃣ TRAINS
  // =========================

  // Helper buat routeStops
  async function createRoute(trainId, stationCodes) {
    for (let i = 0; i < stationCodes.length; i++) {
      await prisma.routeStop.create({
        data: {
          trainId,
          stationId: getStationId(stationCodes[i]),
          stopOrder: i + 1,
          arrivalTime: null,
          departureTime: null,
        }
      });
    }
  }

  // --- KRL ---
  const krlBogor = await prisma.train.create({
    data: {
      name: 'KRL Bogor Line',
      trainType: 'KRL',
      classes: { create: [{ className: 'Ekonomi', price: 5000 }] } // tarif dasar
    }
  });
  await createRoute(krlBogor.id, [
    'BOO','CLB','CTA','DP','DPK','UI','POC','LNA','TJB',
    'PSM','DUR','CW','TEB','MRI','SUD','JAKK'
  ]);

  const krlCikarang = await prisma.train.create({
    data: {
      name: 'KRL Cikarang Line',
      trainType: 'KRL',
      classes: { create: [{ className: 'Ekonomi', price: 5000 }] }
    }
  });
  await createRoute(krlCikarang.id, [
    'CKR','TB','BKST','BKS','KRI','CKI','KLD','JNG','MRI','JAKK'
  ]);

  const krlRangkas = await prisma.train.create({
    data: {
      name: 'KRL Rangkasbitung Line',
      trainType: 'KRL',
      classes: { create: [{ className: 'Ekonomi', price: 8000 }] }
    }
  });
  await createRoute(krlRangkas.id, [
    'RKS','MJA','TGS','PRP','CSA','SRP','RB','SMR','POK','PLM','KBY','TAB'
  ]);

  const krlTangerang = await prisma.train.create({
    data: {
      name: 'KRL Tangerang Line',
      trainType: 'KRL',
      classes: { create: [{ className: 'Ekonomi', price: 5000 }] }
    }
  });
  await createRoute(krlTangerang.id, [
    'TNG','BTCP','POR','RWB','BJI','TMN','PSI','GRO','DUI'
  ]);

  // --- Intercity populer ---

  // 1. Argo Parahyangan - Bandung ↔ Gambir
  const argoParahyangan = await prisma.train.create({
    data: {
      name: 'Argo Parahyangan',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Eksekutif', price: 350000 },
          { className: 'Ekonomi',   price: 150000 },
        ]
      }
    }
  });
  await createRoute(argoParahyangan.id, ['BD','BKS','JNG','GMR']);

  // 2. Lodaya - Bandung ↔ Solo (via YK)
  const lodaya = await prisma.train.create({
    data: {
      name: 'Lodaya',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Eksekutif', price: 320000 },
          { className: 'Bisnis',    price: 220000 },
        ]
      }
    }
  });
  await createRoute(lodaya.id, ['BD','KTA','YK','SLO']);

  // 3. Taksaka - Yogyakarta ↔ Gambir
  const taksaka = await prisma.train.create({
    data: {
      name: 'Taksaka',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Eksekutif', price: 400000 }
        ]
      }
    }
  });
  await createRoute(taksaka.id, ['YK','KTA','CN','JNG','GMR']);

  // 4. Argo Dwipangga - Solo ↔ Gambir
  const argoDwip = await prisma.train.create({
    data: {
      name: 'Argo Dwipangga',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Eksekutif', price: 450000 }
        ]
      }
    }
  });
  await createRoute(argoDwip.id, ['SLO','YK','SMT','CN','JNG','GMR']);

  // 5. Harina - Bandung ↔ Surabaya Pasar Turi
  const harina = await prisma.train.create({
    data: {
      name: 'Harina',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Eksekutif', price: 480000 },
          { className: 'Bisnis',    price: 320000 },
          { className: 'Ekonomi',   price: 220000 },
        ]
      }
    }
  });
  await createRoute(harina.id, ['BD','CN','SMT','SBI']);

  // 6. Gumarang - Pasar Senen ↔ Surabaya Pasar Turi
  const gumarang = await prisma.train.create({
    data: {
      name: 'Gumarang',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Bisnis',  price: 300000 },
          { className: 'Ekonomi', price: 210000 },
        ]
      }
    }
  });
  await createRoute(gumarang.id, ['PSE','CN','TGL','SMT','SBI']);

  // =========================
  // 3️⃣ SCHEDULES
  // =========================

  async function makeSchedule(train, depCode, arrCode, pairs) {
    const depId = getStationId(depCode);
    const arrId = getStationId(arrCode);
    for (const p of pairs) {
      await prisma.schedule.create({
        data: {
          trainId: train.id,
          departureStationId: depId,
          arrivalStationId: arrId,
          departureTime: new Date(p.dep),
          arrivalTime:   new Date(p.arr),
        }
      });
    }
  }

  // KRL (jadwal contoh)
  await makeSchedule(krlBogor, 'BOO','JAKK', [
    { dep: '2025-01-01T05:00:00.000Z', arr: '2025-01-01T06:30:00.000Z' },
    { dep: '2025-01-01T06:00:00.000Z', arr: '2025-01-01T07:30:00.000Z' },
    { dep: '2025-01-01T07:00:00.000Z', arr: '2025-01-01T08:30:00.000Z' },
  ]);
  await makeSchedule(krlBogor, 'JAKK','BOO', [
    { dep: '2025-01-01T16:00:00.000Z', arr: '2025-01-01T17:30:00.000Z' },
    { dep: '2025-01-01T17:00:00.000Z', arr: '2025-01-01T18:30:00.000Z' },
  ]);

  await makeSchedule(krlCikarang, 'CKR','JAKK', [
    { dep: '2025-01-01T05:30:00.000Z', arr: '2025-01-01T07:15:00.000Z' },
    { dep: '2025-01-01T06:30:00.000Z', arr: '2025-01-01T08:15:00.000Z' },
  ]);

  await makeSchedule(krlRangkas, 'RKS','TAB', [
    { dep: '2025-01-01T04:30:00.000Z', arr: '2025-01-01T06:30:00.000Z' },
    { dep: '2025-01-01T06:00:00.000Z', arr: '2025-01-01T08:00:00.000Z' },
  ]);

  await makeSchedule(krlTangerang, 'TNG','DUI', [
    { dep: '2025-01-01T05:15:00.000Z', arr: '2025-01-01T06:15:00.000Z' },
    { dep: '2025-01-01T06:15:00.000Z', arr: '2025-01-01T07:15:00.000Z' },
  ]);

  // Intercity – masing² 2 jadwal PP

  await makeSchedule(argoParahyangan, 'BD','GMR', [
    { dep: '2025-01-01T07:00:00.000Z', arr: '2025-01-01T10:00:00.000Z' },
    { dep: '2025-01-01T14:00:00.000Z', arr: '2025-01-01T17:00:00.000Z' },
  ]);
  await makeSchedule(argoParahyangan, 'GMR','BD', [
    { dep: '2025-01-01T10:30:00.000Z', arr: '2025-01-01T13:30:00.000Z' },
    { dep: '2025-01-01T18:00:00.000Z', arr: '2025-01-01T21:00:00.000Z' },
  ]);

  await makeSchedule(lodaya, 'BD','SLO', [
    { dep: '2025-01-01T07:00:00.000Z', arr: '2025-01-01T15:00:00.000Z' },
  ]);
  await makeSchedule(lodaya, 'SLO','BD', [
    { dep: '2025-01-01T20:00:00.000Z', arr: '2025-01-02T04:00:00.000Z' },
  ]);

  await makeSchedule(taksaka, 'YK','GMR', [
    { dep: '2025-01-01T08:00:00.000Z', arr: '2025-01-01T16:00:00.000Z' },
  ]);
  await makeSchedule(taksaka, 'GMR','YK', [
    { dep: '2025-01-01T21:00:00.000Z', arr: '2025-01-02T05:00:00.000Z' },
  ]);

  await makeSchedule(argoDwip, 'SLO','GMR', [
    { dep: '2025-01-01T09:00:00.000Z', arr: '2025-01-01T17:00:00.000Z' },
  ]);
  await makeSchedule(argoDwip, 'GMR','SLO', [
    { dep: '2025-01-01T22:00:00.000Z', arr: '2025-01-02T06:00:00.000Z' },
  ]);

  await makeSchedule(harina, 'BD','SBI', [
    { dep: '2025-01-01T16:00:00.000Z', arr: '2025-01-02T04:00:00.000Z' },
  ]);
  await makeSchedule(harina, 'SBI','BD', [
    { dep: '2025-01-02T16:00:00.000Z', arr: '2025-01-03T04:00:00.000Z' },
  ]);

  await makeSchedule(gumarang, 'PSE','SBI', [
    { dep: '2025-01-01T15:00:00.000Z', arr: '2025-01-02T05:00:00.000Z' },
  ]);
  await makeSchedule(gumarang, 'SBI','PSE', [
    { dep: '2025-01-02T15:00:00.000Z', arr: '2025-01-03T05:00:00.000Z' },
  ]);

  console.log('✅ Seeding selesai!');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
