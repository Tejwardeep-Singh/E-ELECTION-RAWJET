const mongoose = require("mongoose");

const voterSchema = mongoose.Schema({
    epicNumber:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        uppercase: true,
    },
    userId:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    address: {
        area: {
            type: String,
            required: true,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
    },
    password:{
        type:String,
        required:true,
    },
    mustChangePassword: {
        type: Boolean,
        default: true,
    },
    photoUrl: {
        type: String
    },
    faceEmbedding: {
        type: [Number],
        default: undefined,
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
}, {
    timestamps: true,
});
module.exports = mongoose.model("voter",voterSchema);
