const mongoose = require('mongoose');

// Define MongoDB schema
const tickerSchema = new mongoose.Schema({
  base_unit: String,
quote_unit: String,
low: Number,
high: Number,
last: Number,
type: String,
open: Number,
volume: Number,
sell: Number,
buy: Number,
at: Number,
name: String,
});

// Define MongoDB model
const Ticker = mongoose.model('Ticker', tickerSchema);

module.exports = Ticker;