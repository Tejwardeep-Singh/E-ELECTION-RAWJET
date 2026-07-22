const mongoose = require("mongoose");

const masterConstituencySchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    city: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    electionType: {
      type: String,
      enum: [
        "Panchayat",
        "Municipal",
        "District",
        "Assembly",
        "Lok Sabha",
        "Student Council",
        "Other"
        ],
      index: true,
    },

    constituencyNumber: {
      type: Number,
      default: null,
    },

    constituencyName: {
      type: String,
      required: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate constituencies
masterConstituencySchema.index(
  {
    electionType: 1,
    state: 1,
    city: 1,
    constituencyNumber: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

// Fast searching
masterConstituencySchema.index({
  electionType: 1,
  state: 1,
  city: 1,
  active: 1,
});

module.exports = mongoose.model(
  "MasterConstituency",
  masterConstituencySchema
);