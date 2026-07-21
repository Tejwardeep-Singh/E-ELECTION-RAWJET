const mongoose = require('mongoose');

const constituencySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true, index: true },
}, { timestamps: true });

constituencySchema.index({ electionId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Constituency', constituencySchema);
