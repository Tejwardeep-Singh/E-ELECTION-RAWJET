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

    constituencies: {
  municipal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterConstituency",
    required: true,
    index: true,
  },

  assembly: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterConstituency",
    required: true,
    index: true,
  },

  lokSabha: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MasterConstituency",
    required: true,
    index: true,
  },
},

    password: {
      type: String,
      required: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    photo: {
      original: {
          type: String,
          default: "",
      },

      processed: {
          type: String,
          default: "",
      },

      uploadedAt: {
          type: Date,
      },
  },

      biometric: {
    enrolled: {
      type: Boolean,
      default: false,
    },

    faceEmbeddingPath: {
      type: String,
      default: "",
      select: false,
    },

    modelVersion: {
      type: String,
      default: "InsightFace-v1",
    },

    enrolledAt: Date,
  },
      votingStatus: {
        type: String,
        enum: ["not_voted", "verified", "voted"],
        default: "not_voted",
      },

      lastVerification: {
    success: {
      type: Boolean,
      default: false,
    },

    confidence: {
      type: Number,
      default: 0,
    },

    time: Date,

    method: {
      type: String,
      enum: ["face", "manual"],
      default: "face",
    },
  },
  dateOfBirth: {
    type: Date,
    required: true,
},
gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
},

guardianName: {
    type: String,
    required: true,
    trim: true,
},

mobile: {
    type: String,
    required: true,
    trim: true,
},

address: {

    state: String,

    district: String,

    city: String,

    houseNo: String,

    street: String,

    pincode: String,
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
voterSchema.index({
  electionId: 1,
  "constituencies.municipal": 1,
});

voterSchema.index({
  electionId: 1,
  "constituencies.assembly": 1,
});

voterSchema.index({
  electionId: 1,
  "constituencies.lokSabha": 1,
});

module.exports = mongoose.model("Voter", voterSchema);