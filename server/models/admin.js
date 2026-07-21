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
    address: {
        state: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },
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
