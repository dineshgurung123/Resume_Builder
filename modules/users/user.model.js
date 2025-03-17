const { required } = require('joi')
const {Schema, model} = require('mongoose')



const userSchema = new Schema({

    name : {type : String, required : true},
    email : {type : String, required : true, unique: true},
    password : {type : String, required : true},
    isBlocked : {type : Boolean, required : true, default : false},
    isEmailVerified : {type : Boolean, required : true, default : false  },
    otp : {type : String},
    roles : {type : [String] , enum : ["admin", "user"], default : "user"}

}, 
{timestamps : true}) 


    module.exports = model("User", userSchema)