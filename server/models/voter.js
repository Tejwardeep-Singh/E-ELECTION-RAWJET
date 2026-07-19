const mongoose = require("mongoose");

const voterSchema = mongoose.Schema({
    epicNumber:{
        type:String,
        required:true,
        unique:true,
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
    password:{
        type:String,
        required:true,
    },
    hasVoted: {
        type: Boolean,
        default: false,
    },
    photo: {
        type: String
    },
    faceEmbedding:{
    type:[Number]
},
status:{
    type:String,
    enum:["active","inactive","suspended"],
    default:"active"
}
});
module.exports = mongoose.model("voter",voterSchema);