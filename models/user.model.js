const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name:{
        type:String,
        required:[true,"name not provided"]
    },
    email:{
        type:String,
        required: [true, "email not provided"],
        unique:true
    },
    password:{
        type: String,
        required: [true, "password not provided"]
    }
},{
    versionKey:false,
    timestamps:true
})

let UserModel = mongoose.model("user",userSchema);

module.exports = {UserModel}