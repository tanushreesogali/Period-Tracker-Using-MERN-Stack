const userService=require("../services/userService");

class UserController{
    async createUser(req,res){
        try{
            const { email, name, password }=req.body;
            const saveUser=await userService.createUser(email,name,password);
            if(saveUser){
                res.json("Profile created successfully");
            }
            else{
                res.json("Name already exists!")
            }
            
            
        }catch{
            res.status(500).json("Error while creating profile")
        }
    }
}

module.exports= new UserController();