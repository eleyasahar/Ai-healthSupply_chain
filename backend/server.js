require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PHC = require('./models/PHC');
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');
const calculateRedistributionNeed = require('./redistributionEngine');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Basic CRUD Routes
app.get('/api/phcs', async (req, res) => {
  try {
    const phcs = await PHC.find();
    res.json(phcs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Automated Cross-District Redistribution Route
app.get('/api/redistribute', async (req, res) => {
  try {
    const phcs = await PHC.find();
    const inventory = await Inventory.find();

    // Call redistribution logic
    const alerts = calculateRedistributionNeed(phcs, inventory);
    res.json({
      timestamp: new Date(),
      alerts_count: alerts.length,
      alerts: alerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//post api 
app.post('/api/phcs', async (req, res) => {
  try {
    const newPHC = new PHC(req.body);
    const savedPHC = await newPHC.save();

    res.status(201).json(savedPHC);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.post('/api/inventory', async (req, res) => {
  try {
    const newInventory = new Inventory(req.body);
    const savedInventory = await newInventory.save();

    res.status(201).json(savedInventory);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Express Server running on port ${PORT}`);
});