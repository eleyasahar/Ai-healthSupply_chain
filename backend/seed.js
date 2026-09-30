require('dotenv').config();
const mongoose = require('mongoose');

const PHC = require('./models/PHC');
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');

const samplePHCs = [
  {
    phc_id: 'PHC_UP_BIJ_012',
    name: 'Chandpur Primary Health Centre',
    district_id: 'DIST_BIJ_01',
    state: 'Uttar Pradesh',
    capacity: { total_beds: 50, occupied_beds: 38 },
    personnel: { doctors_present: 4, nurses_present: 8 },
    coordinates: { lat: 29.138, lng: 78.272 }
  },
  {
    phc_id: 'PHC_UP_BIJ_045',
    name: 'Dhampur Primary Health Centre',
    district_id: 'DIST_BIJ_01',
    state: 'Uttar Pradesh',
    capacity: { total_beds: 40, occupied_beds: 35 },
    personnel: { doctors_present: 3, nurses_present: 6 },
    coordinates: { lat: 29.310, lng: 78.510 }
  }
];

const sampleInventory = [
  {
    phc_id: 'PHC_UP_BIJ_012',
    item_id: 'MED_PARACETAMOL_500',
    item_name: 'Paracetamol 500mg',
    current_stock: 450,
    daily_consumption_avg: 80,
    minimum_threshold: 200,
    last_updated: new Date()
  },
  {
    phc_id: 'PHC_UP_BIJ_045',
    item_id: 'MED_PARACETAMOL_500',
    item_name: 'Paracetamol 500mg',
    current_stock: 50, // Shortage State
    daily_consumption_avg: 60,
    minimum_threshold: 150,
    last_updated: new Date()
  }
];

const sampleOrders = [
  {
    order_id: 'ORD_2026_9821',
    source_phc_id: 'PHC_UP_BIJ_012',
    target_phc_id: 'PHC_UP_BIJ_045',
    item_id: 'MED_PARACETAMOL_500',
    quantity: 150,
    status: 'RECOMMENDED',
    reason: 'Predicted Stock-out in target PHC within 48 hours'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('⚡ Connected to MongoDB for Seeding...');

    // Clear existing data
    await PHC.deleteMany({});
    await Inventory.deleteMany({});
    await Order.deleteMany({});

    // Insert new dummy data
    await PHC.insertMany(samplePHCs);
    await Inventory.insertMany(sampleInventory);
    await Order.insertMany(sampleOrders);

    console.log('✅ Seed Data Successfully Loaded!');
    process.exit();
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
};

seedDatabase();