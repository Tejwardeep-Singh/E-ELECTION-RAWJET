const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
        default: "",
    },

    type: {
        type: String,
        required: true,
        enum: [
            "Lok Sabha",
            "Assembly",
            "District",
            "Municipal",
            "Panchayat",
            "Student Council",
            "Other",
        ],
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

    status: {
        type: String,
        enum: [
            "Draft",
            "Active",
            "Completed",
            "Archived",
        ],
        default: "Draft",
    },

    startDate: {
        type: Date,
        default: null,
    },

    endDate: {
        type: Date,
        default: null,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "head",
        required: true,
    },
},
{
    timestamps: true,
}
);

// Helpful indexes
electionSchema.index({ type: 1 });
electionSchema.index({ status: 1 });
electionSchema.index({ state: 1 });
electionSchema.index({ district: 1 });
electionSchema.index({ city: 1 });

module.exports = mongoose.model("Election", electionSchema);