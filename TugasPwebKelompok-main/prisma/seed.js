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
    { code: 'BD', name: 'Bandung', city: 'Bandung', stationType: 'Intercity' },
    { code: 'GMR', name: 'Gambir', city: 'Jakarta Pusat', stationType: 'Intercity' },
    { code: 'PSE', name: 'Pasar Senen', city: 'Jakarta Pusat', stationType: 'Intercity' },
    { code: 'CN', name: 'Cirebon', city: 'Cirebon', stationType: 'Intercity' },
    { code: 'TGL', name: 'Tegal', city: 'Tegal', stationType: 'Intercity' },
    { code: 'SMT', name: 'Semarang Tawang', city: 'Semarang', stationType: 'Intercity' },
    { code: 'KTA', name: 'Kutoarjo', city: 'Kutoarjo', stationType: 'Intercity' },
    { code: 'YK', name: 'Yogyakarta', city: 'Yogyakarta', stationType: 'Intercity' },
    { code: 'SLO', name: 'Solo Balapan', city: 'Surakarta', stationType: 'Intercity' },
    { code: 'SGU', name: 'Surabaya Gubeng', city: 'Surabaya', stationType: 'Intercity' },
    { code: 'SBI', name: 'Surabaya Pasar Turi', city: 'Surabaya', stationType: 'Intercity' },

    // Stasiun shared Intercity + KRL
    { code: 'BKS', name: 'Bekasi', city: 'Bekasi', stationType: 'Both' },
    { code: 'JNG', name: 'Jatinegara', city: 'Jakarta Timur', stationType: 'Both' },
    { code: 'MRI', name: 'Manggarai', city: 'Jakarta Selatan', stationType: 'Both' },
    { code: 'TAB', name: 'Tanah Abang', city: 'Jakarta Pusat', stationType: 'Both' },

    // KRL Bogor Line (disederhanakan)
    { code: 'BOO', name: 'Bogor', city: 'Bogor', stationType: 'KRL' },
    { code: 'CLB', name: 'Cilebut', city: 'Bogor', stationType: 'KRL' },
    { code: 'CTA', name: 'Citayam', city: 'Depok', stationType: 'KRL' },
    { code: 'DP', name: 'Depok', city: 'Depok', stationType: 'KRL' },
    { code: 'DPK', name: 'Depok Baru', city: 'Depok', stationType: 'KRL' },
    { code: 'UI', name: 'Universitas Indonesia', city: 'Depok', stationType: 'KRL' },
    { code: 'POC', name: 'Pondok Cina', city: 'Depok', stationType: 'KRL' },
    { code: 'LNA', name: 'Lenteng Agung', city: 'Jakarta Selatan', stationType: 'KRL' },
    { code: 'TJB', name: 'Tanjung Barat', city: 'Jakarta Selatan', stationType: 'KRL' },
    { code: 'PSM', name: 'Pasar Minggu', city: 'Jakarta Selatan', stationType: 'KRL' },
    { code: 'DUR', name: 'Duren Kalibata', city: 'Jakarta Selatan', stationType: 'KRL' },
    { code: 'CW', name: 'Cawang', city: 'Jakarta Timur', stationType: 'KRL' },
    { code: 'TEB', name: 'Tebet', city: 'Jakarta Selatan', stationType: 'KRL' },
    { code: 'SUD', name: 'Sudirman', city: 'Jakarta Pusat', stationType: 'KRL' },
    { code: 'JAKK', name: 'Jakarta Kota', city: 'Jakarta Barat', stationType: 'KRL' },
    { code: 'DUI', name: 'Duri', city: 'Jakarta Barat', stationType: 'KRL' },
    { code: 'KPB', name: 'Kampung Bandan', city: 'Jakarta Utara', stationType: 'KRL' },

    // KRL Cikarang Line (disederhanakan)
    { code: 'CKR', name: 'Cikarang', city: 'Bekasi', stationType: 'KRL' },
    { code: 'TB', name: 'Tambun', city: 'Bekasi', stationType: 'KRL' },
    { code: 'BKST', name: 'Bekasi Timur', city: 'Bekasi', stationType: 'KRL' },
    { code: 'KRI', name: 'Kranji', city: 'Bekasi', stationType: 'KRL' },
    { code: 'CKI', name: 'Cakung', city: 'Jakarta Timur', stationType: 'KRL' },
    { code: 'KLD', name: 'Klender', city: 'Jakarta Timur', stationType: 'KRL' },

    // KRL Rangkasbitung Line (disederhanakan)
    { code: 'RKS', name: 'Rangkasbitung', city: 'Lebak', stationType: 'KRL' },
    { code: 'MJA', name: 'Maja', city: 'Lebak', stationType: 'KRL' },
    { code: 'TGS', name: 'Tigaraksa', city: 'Tangerang', stationType: 'KRL' },
    { code: 'PRP', name: 'Parung Panjang', city: 'Bogor', stationType: 'KRL' },
    { code: 'CSA', name: 'Cisauk', city: 'Tangerang', stationType: 'KRL' },
    { code: 'SRP', name: 'Serpong', city: 'Tangerang', stationType: 'KRL' },
    { code: 'RB', name: 'Rawa Buntu', city: 'Tangerang', stationType: 'KRL' },
    { code: 'SMR', name: 'Sudimara', city: 'Tangerang', stationType: 'KRL' },
    { code: 'POK', name: 'Pondok Ranji', city: 'Tangerang', stationType: 'KRL' },
    { code: 'PLM', name: 'Palmerah', city: 'Jakarta Pusat', stationType: 'KRL' },
    { code: 'KBY', name: 'Kebayoran', city: 'Jakarta Selatan', stationType: 'KRL' },

    // KRL Tangerang Line (disederhanakan)
    { code: 'TNG', name: 'Tangerang', city: 'Tangerang', stationType: 'KRL' },
    { code: 'BTCP', name: 'Batu Ceper', city: 'Tangerang', stationType: 'KRL' },
    { code: 'POR', name: 'Poris', city: 'Tangerang', stationType: 'KRL' },
    { code: 'RWB', name: 'Rawa Buaya', city: 'Jakarta Barat', stationType: 'KRL' },
    { code: 'BJI', name: 'Bojong Indah', city: 'Jakarta Barat', stationType: 'KRL' },
    { code: 'TMN', name: 'Taman Kota', city: 'Jakarta Barat', stationType: 'KRL' },
    { code: 'PSI', name: 'Pesing', city: 'Jakarta Barat', stationType: 'KRL' },
    { code: 'GRO', name: 'Grogol', city: 'Jakarta Barat', stationType: 'KRL' },
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
    'BOO', 'CLB', 'CTA', 'DP', 'DPK', 'UI', 'POC', 'LNA', 'TJB',
    'PSM', 'DUR', 'CW', 'TEB', 'MRI', 'SUD', 'JAKK'
  ]);

  const krlCikarang = await prisma.train.create({
    data: {
      name: 'KRL Cikarang Line',
      trainType: 'KRL',
      classes: { create: [{ className: 'Ekonomi', price: 5000 }] }
    }
  });
  await createRoute(krlCikarang.id, [
    'CKR', 'TB', 'BKST', 'BKS', 'KRI', 'CKI', 'KLD', 'JNG', 'MRI', 'JAKK'
  ]);

  const krlRangkas = await prisma.train.create({
    data: {
      name: 'KRL Rangkasbitung Line',
      trainType: 'KRL',
      classes: { create: [{ className: 'Ekonomi', price: 8000 }] }
    }
  });
  await createRoute(krlRangkas.id, [
    'RKS', 'MJA', 'TGS', 'PRP', 'CSA', 'SRP', 'RB', 'SMR', 'POK', 'PLM', 'KBY', 'TAB'
  ]);

  const krlTangerang = await prisma.train.create({
    data: {
      name: 'KRL Tangerang Line',
      trainType: 'KRL',
      classes: { create: [{ className: 'Ekonomi', price: 5000 }] }
    }
  });
  await createRoute(krlTangerang.id, [
    'TNG', 'BTCP', 'POR', 'RWB', 'BJI', 'TMN', 'PSI', 'GRO', 'DUI'
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
          { className: 'Ekonomi', price: 150000 },
        ]
      }
    }
  });
  await createRoute(argoParahyangan.id, ['BD', 'BKS', 'JNG', 'GMR']);

  // 2. Lodaya - Bandung ↔ Solo (via YK)
  const lodaya = await prisma.train.create({
    data: {
      name: 'Lodaya',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Eksekutif', price: 320000 },
          { className: 'Bisnis', price: 220000 },
        ]
      }
    }
  });
  await createRoute(lodaya.id, ['BD', 'KTA', 'YK', 'SLO']);

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
  await createRoute(taksaka.id, ['YK', 'KTA', 'CN', 'JNG', 'GMR']);

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
  await createRoute(argoDwip.id, ['SLO', 'YK', 'SMT', 'CN', 'JNG', 'GMR']);

  // 5. Harina - Bandung ↔ Surabaya Pasar Turi
  const harina = await prisma.train.create({
    data: {
      name: 'Harina',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Eksekutif', price: 480000 },
          { className: 'Bisnis', price: 320000 },
          { className: 'Ekonomi', price: 220000 },
        ]
      }
    }
  });
  await createRoute(harina.id, ['BD', 'CN', 'SMT', 'SBI']);

  // 6. Gumarang - Pasar Senen ↔ Surabaya Pasar Turi
  const gumarang = await prisma.train.create({
    data: {
      name: 'Gumarang',
      trainType: 'Intercity',
      classes: {
        create: [
          { className: 'Bisnis', price: 300000 },
          { className: 'Ekonomi', price: 210000 },
        ]
      }
    }
  });
  await createRoute(gumarang.id, ['PSE', 'CN', 'TGL', 'SMT', 'SBI']);

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
          arrivalTime: new Date(p.arr),
        }
      });
    }
  }

  // Helper dates (DYNAMIC)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Helper function to create date object from HH:mm
  const getDate = (baseDate, timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  // KRL (jadwal contoh - BANYAK FREKUENSI)
  // Bogor -> Jakarta Kota
  await makeSchedule(krlBogor, 'BOO', 'JAKK', [
    { dep: getDate(today, '05:00'), arr: getDate(today, '06:30') },
    { dep: getDate(today, '05:30'), arr: getDate(today, '07:00') },
    { dep: getDate(today, '06:00'), arr: getDate(today, '07:30') },
    { dep: getDate(today, '06:30'), arr: getDate(today, '08:00') },
    { dep: getDate(today, '07:00'), arr: getDate(today, '08:30') },
    { dep: getDate(today, '08:00'), arr: getDate(today, '09:30') },
    { dep: getDate(today, '17:00'), arr: getDate(today, '18:30') }, // Pulang kerja
  ]);

  // Jakarta Kota -> Bogor
  await makeSchedule(krlBogor, 'JAKK', 'BOO', [
    { dep: getDate(today, '06:00'), arr: getDate(today, '07:30') },
    { dep: getDate(today, '16:00'), arr: getDate(today, '17:30') },
    { dep: getDate(today, '17:00'), arr: getDate(today, '18:30') },
    { dep: getDate(today, '18:00'), arr: getDate(today, '19:30') },
    { dep: getDate(today, '19:00'), arr: getDate(today, '20:30') },
  ]);

  // Cikarang -> Jakarta The
  await makeSchedule(krlCikarang, 'CKR', 'JAKK', [
    { dep: getDate(today, '05:30'), arr: getDate(today, '07:15') },
    { dep: getDate(today, '06:30'), arr: getDate(today, '08:15') },
    { dep: getDate(today, '07:30'), arr: getDate(today, '09:15') },
  ]);

  await makeSchedule(krlRangkas, 'RKS', 'TAB', [
    { dep: getDate(today, '04:30'), arr: getDate(today, '06:30') },
    { dep: getDate(today, '06:00'), arr: getDate(today, '08:00') },
  ]);

  await makeSchedule(krlTangerang, 'TNG', 'DUI', [
    { dep: getDate(today, '05:15'), arr: getDate(today, '06:15') },
    { dep: getDate(today, '06:15'), arr: getDate(today, '07:15') },
    { dep: getDate(today, '07:15'), arr: getDate(today, '08:15') },
  ]);

  // Intercity – masing² 2 jadwal PP
  await makeSchedule(argoParahyangan, 'BD', 'GMR', [
    { dep: getDate(today, '07:00'), arr: getDate(today, '10:00') },
    { dep: getDate(today, '14:00'), arr: getDate(today, '17:00') },
    { dep: getDate(tomorrow, '07:00'), arr: getDate(tomorrow, '10:00') },
  ]);
  await makeSchedule(argoParahyangan, 'GMR', 'BD', [
    { dep: getDate(today, '10:30'), arr: getDate(today, '13:30') },
    { dep: getDate(today, '18:00'), arr: getDate(today, '21:00') },
  ]);

  await makeSchedule(lodaya, 'BD', 'SLO', [
    { dep: getDate(today, '07:00'), arr: getDate(today, '15:00') },
  ]);

  await makeSchedule(taksaka, 'YK', 'GMR', [
    { dep: getDate(today, '08:00'), arr: getDate(today, '16:00') },
  ]);

  await makeSchedule(taksaka, 'GMR', 'YK', [
    { dep: getDate(today, '21:00'), arr: getDate(tomorrow, '05:00') },
  ]);

  await makeSchedule(argoDwip, 'SLO', 'GMR', [
    { dep: getDate(today, '09:00'), arr: getDate(today, '17:00') },
  ]);

  await makeSchedule(harina, 'BD', 'SBI', [
    { dep: getDate(today, '16:00'), arr: getDate(tomorrow, '04:00') },
  ]);

  await makeSchedule(gumarang, 'PSE', 'SBI', [
    { dep: getDate(today, '15:00'), arr: getDate(tomorrow, '05:00') },
  ]);

  console.log('✅ Seeding selesai! Jadwal updated untuk: ' + today.toDateString());
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
