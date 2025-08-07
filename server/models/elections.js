const mongoose = require('mongoose');

const electionConfigSchema = new mongoose.Schema({
  electionLive: {
    type: Boolean,
    default: false
  },
  resultVisible: {
    type: Boolean,
    default: false
  },
  showResult: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ElectionConfig', electionConfigSchema);
