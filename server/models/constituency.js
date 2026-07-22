const mongoose = require('mongoose');

const constituencySchema = new mongoose.Schema({
  // Legacy fields are retained because voter/candidate/admin flows use them.
  name: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true, index: true },
  // Election-specific fields copied from MasterConstituency.
  election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true, index: true },
  constituencyNumber: { type: Number, default: null },
  constituencyName: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

constituencySchema.index({ electionId: 1, name: 1 }, { unique: true });
constituencySchema.index({ electionId: 1, constituencyNumber: 1 }, { sparse: true });

module.exports = mongoose.model('Constituency', constituencySchema);
