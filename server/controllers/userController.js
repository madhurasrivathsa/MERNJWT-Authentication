import userModel from "../models/userModel.js";
export const getUserData=async(req,res)=>{
    try {
        const {userId}=req.body
        console.log("the user ID is ",userId)
        const user=await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"User not Available"})
        }
        res.json({success:true,userData:{name:user.name,isAccoutVerified:user.isAccoutVerified}})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
}