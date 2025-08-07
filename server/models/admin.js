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
});
module.exports = mongoose.model("admin",adminSchema);