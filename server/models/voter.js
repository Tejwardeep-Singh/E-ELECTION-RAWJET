const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    epicNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    userId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    masterConstituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterConstituency",
      required: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    photoUrl: {
      type: String,
    },

    // Indicates whether the voter's facial biometric
    // has been successfully enrolled.
    faceEnrolled: {
      type: Boolean,
      default: false,
    },

    votingStatus: {
      type: String,
      enum: ["not_voted", "verified", "voted"],
      default: "not_voted",
    },

    lastVerification: {
      success: Boolean,
      confidence: Number,
      time: Date,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voter", voterSchema);