const mongoose = require("mongoose");

const constituencySchema = new mongoose.Schema(
{
    // Legacy field used throughout the app
    name: {
        type: String,
        required: true,
        trim: true,
    },

    // Location hierarchy
    state: {
        type: String,
        trim: true,
        default: null,
    },

    district: {
        type: String,
        trim: true,
        default: null,
    },

    city: {
        type: String,
        trim: true,
        default: null,
    },

    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true,
        index: true,
    },

    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true,
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
    }
},
{
    timestamps: true,
}
);

constituencySchema.index(
    { electionId: 1, name: 1 },
    { unique: true }
);

constituencySchema.index(
    { electionId: 1, constituencyNumber: 1 },
    { sparse: true }
);

module.exports = mongoose.model("Constituency", constituencySchema);