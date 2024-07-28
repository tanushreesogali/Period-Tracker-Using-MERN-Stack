const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const User= mongoose.model("profiles",userSchema);

module.exports=User;
