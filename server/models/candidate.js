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
    area:{
        type:String,
        required:true,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    candidateImage:{
        type:String,
        required:true,
    },
    partyImage:{
        type:String,
        required:true,
    },
    crimminalCase:{
        type:String,
    },
    voteCount:{
        type:Number,
    }
    
});
module.exports = mongoose.model("candidate",candidateSchema);