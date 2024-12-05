import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String},
    passcode:{type:String},
    isAdmin:{type:Boolean, default:false}

})

const User = mongoose.model("User", userSchema)
export default User;