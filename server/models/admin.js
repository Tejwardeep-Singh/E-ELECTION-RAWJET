const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true,
        unique: true
    },
    name:{
        type:String,
    },
    password:{
        type:String,
        required: true
    },
    profileImage: { type: String, default: '' },
    // Jurisdiction assignment is stored by ObjectId below.  Keep the legacy
    // location fields only for state/city compatibility; never store the
    // constituency name on an Admin record.
    address: {
        state: { type: String },
        city: { type: String },
    },
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true,
        index: true,
    },
    constituencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Constituency',
        required: true,
        index: true,
    },
});
module.exports = mongoose.model("admin",adminSchema);
