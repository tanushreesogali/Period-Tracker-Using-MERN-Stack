const User=require("../models/userModel");

class UserService{
    async checkExist(email){
        const existingUser=await User.findOne({email:email});
        if(existingUser){
            return false;
        }
        return true;
    }
    async createUser(email,name,password){
        const checkUser=await this.checkExist(email);

        if(checkUser){
            const newUser=new User({email,name,password});
            return await newUser.save();
        }
        return false;

        
    }

}
module.exports=new UserService();