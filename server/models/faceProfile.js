const mongoose = require('mongoose');

const faceProfileSchema = new mongoose.Schema({
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'voter',
    required: true,
    unique: true,
    index: true,
  },
  // Never return biometric templates from public API endpoints.
  embedding: {
    type: [Number],
    required: true,
    select: false,
  },
  model: {
    type: String,
    required: true,
  },
  embeddingVersion: {
    type: String,
    required: true,
    default: '1',
  },
  photoUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FaceProfile', faceProfileSchema);
