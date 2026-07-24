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

    district: {
      type: String,
      default: null,
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
        "Other",
      ],
      required: true,
      index: true,
    },

    constituencyNumber: {
      type: Number,
      required: true,
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

masterConstituencySchema.index(
  {
    electionType: 1,
    state: 1,
    district: 1,
    city: 1,
    constituencyNumber: 1,
  },
  {
    unique: true,
  }
);

masterConstituencySchema.index({
  electionType: 1,
  state: 1,
  district: 1,
  city: 1,
  active: 1,
});

module.exports = mongoose.model(
  "MasterConstituency",
  masterConstituencySchema
);