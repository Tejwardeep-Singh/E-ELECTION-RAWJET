const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema({
    id:{
        type:Number,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,

    },
    address: {
        state: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },
    },
    candidateImage:{
        type:String,
        required:true,
    },
    partyImage:{
        type:String,
        required:true,
    },
    criminalCase:{
        type:String,
    },
    voteCount:{
        type:Number,
    }
    ,electionId: {
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
candidateSchema.index({ electionId: 1, id: 1 }, { unique: true });
module.exports = mongoose.model("candidate",candidateSchema);
