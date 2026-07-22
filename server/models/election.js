const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  type: {
    type: String,
    required: true,
    enum: ['Panchayat', 'Municipal', 'District', 'Assembly', 'Lok Sabha', 'Student Council', 'Other'],
  },
  state: { type: String, required: true, trim: true },
  // City is optional because several election types (for example Assembly and
  // Lok Sabha) are state-wide.  When present it scopes master constituencies.
  city: { type: String, trim: true, default: null },
  status: { type: String, enum: ['Draft', 'Active', 'Completed', 'Archived'], default: 'Draft', index: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'head', required: true },
}, { timestamps: true });

electionSchema.index({ state: 1, status: 1 });

module.exports = mongoose.model('Election', electionSchema);
