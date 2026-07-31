const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voter",
      required: true,
      index: true,
    },

    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },

    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One voter can vote only once in one election
participationSchema.index(
  {
    voterId: 1,
    electionId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Participation",
  participationSchema
);