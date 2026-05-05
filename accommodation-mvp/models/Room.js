const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  price:    { type: Number, required: true },
  location: { type: String, required: true },
  images:   { type: [String], default: [] },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── NEW FIELDS ──────────────────────────────────────────────
  address:         { type: String },                           // Full address or area
  securityDeposit: { type: Number, default: 0 },              // Deposit amount
  amenities:       { type: [String], default: [] },           // WiFi, kitchen, parking, etc.
  roomType:        { type: String, enum: ['single', 'shared', 'studio', 'apartment'], required: true },
  furnishing:      { type: String, enum: ['furnished', 'semi', 'unfurnished'], required: true },
  availableFrom:   { type: Date, required: true },
  minStay:         { type: Number },                           // months, optional
  additionalNotes: { type: String },
  anmeldung:       { type: Boolean, default: null },           // city registration possible
  status:          { type: String, enum: ['available', 'occupied'], default: 'available' }
  // ────────────────────────────────────────────────────────────
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
