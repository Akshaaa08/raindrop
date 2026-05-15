const Kiosk = require('../models/Kiosk');

const kiosksData = [
  {
    kioskId: 'KSK-PUNE-01',
    name: 'Pune Station Kiosk',
    city: 'Pune',
    location: 'Pune Railway Station, Platform 1',
    totalUmbrellas: 15,
    availableUmbrellas: 12,
    coordinates: { lat: 18.5294, lng: 73.8742 },
  },
  {
    kioskId: 'KSK-PUNE-02',
    name: 'FC Road Kiosk',
    city: 'Pune',
    location: 'FC Road, Near Goodluck Café',
    totalUmbrellas: 10,
    availableUmbrellas: 8,
    coordinates: { lat: 18.5167, lng: 73.8407 },
  },
  {
    kioskId: 'KSK-MUM-01',
    name: 'CST Mumbai Kiosk',
    city: 'Mumbai',
    location: 'Chhatrapati Shivaji Maharaj Terminus, Gate 2',
    totalUmbrellas: 20,
    availableUmbrellas: 17,
    coordinates: { lat: 18.9402, lng: 72.8355 },
  },
  {
    kioskId: 'KSK-MUM-02',
    name: 'Bandra West Kiosk',
    city: 'Mumbai',
    location: 'Bandra West, Linking Road',
    totalUmbrellas: 12,
    availableUmbrellas: 9,
    coordinates: { lat: 19.0600, lng: 72.8362 },
  },
  {
    kioskId: 'KSK-BLR-01',
    name: 'MG Road Kiosk',
    city: 'Bengaluru',
    location: 'MG Road Metro Station, Exit B',
    totalUmbrellas: 18,
    availableUmbrellas: 15,
    coordinates: { lat: 12.9758, lng: 77.6069 },
  },
  {
    kioskId: 'KSK-HYD-01',
    name: 'Hitech City Kiosk',
    city: 'Hyderabad',
    location: 'Hitech City Metro Station',
    totalUmbrellas: 14,
    availableUmbrellas: 11,
    coordinates: { lat: 17.4474, lng: 78.3762 },
  },
];

const seedKiosks = async () => {
  try {
    const count = await Kiosk.countDocuments();
    if (count === 0) {
      await Kiosk.insertMany(kiosksData);
      console.log('🌱 Kiosks seeded successfully');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = { seedKiosks };
