import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';
export const register=async(req,res)=>{
    const{name,email,password}=req.body;
    if(!name || !email || !password){
        return res.json({success:false,message:'Missing Details'})
    }

    try {
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"User already exists"})
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const user=new userModel({name,email,password:hashedPassword})
        await user.save()
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })

        //sending welcome email
        const MailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:`Welcome to Madhura's Learning`,
            text:`Welcome to Madhura's Learning, Your Account has been created successfully for email ${email}`
        }
        await transporter.sendMail(MailOptions)


        return res.json({success:true})
        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}

export const login =async(req,res)=>{
    const{email,password}=req.body;
    if(!email ||!password){
        return res.json({success:false,message:"email and password are required"})
    }
    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"user with this email address does nto exist"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"Password is not correct"})
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }

}


export const logout=async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
           })

        return res.json({success:true,message:"Logged Out"})   
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//Send Verification OTP to the users EMail

export const sendVerifyOtp=async(req,res)=>{
    try {
        const {userId}=req.body
        const user=await userModel.findById(userId)
        if(user.isAccountVerified){
            return res.json({success:false,message:"User Account Already Verified"})
        }
        const otp=String(Math.floor(100000+Math.random()*900000))
        user.verifyOtp=otp;
        user.verifyOtpExpireAt=Date.now() + 24 * 60 * 60 * 1000;
        await user.save()
        const MailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:`Account Verification OTP`,
            text:`Your OTP is ${otp} Verify your account using this otp`
        }
        await transporter.sendMail(MailOptions)
        return res.json({success:true,message:"Verification OTP Mail Sent"})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
}

export const verifyEmail=async(req,res)=>{
    const{userId,otp}=req.body
    if(!userId || !otp){
        return res.json({success:false,message:"Missing Details"})
    }
    try {
        const user = await userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"user does not exists"})
        }
        if(user.verifyOtp===''||user.verifyOtp!==otp){
            return res.json({success:false,message:"otp is not matching"})
        }
        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({success:false,message:"otp is expired"})
        }
        user.isAccountVerified=true
        user.verifyOtp='';
        user.verifyOtpExpireAt=0
        await user.save();
        return res.json({success:true,message:"Email Verified with otp"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
//check if the user authenticated
export const isAuthenticated=async(req,res)=>{
    try {
        return res.json({success:true,message:"user Authenticated"})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }

}
//sen password reset otp
export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:false,message:"Email is required"})
    }
    try {
        const user= await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        const otp=String(Math.floor(100000+Math.random()*900000))
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now() + 24 * 60 * 60 * 1000;
        await user.save()
        const MailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:`Password Reset OTP`,
            text:`Your OTP for resetting the password is  ${otp} Verify your account using this otp`
        }
        await transporter.sendMail(MailOptions)
        return res.json({success:true,message:"OTP send to your Email Address"})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
}

//reset user password 
export const resetPassword=async(req,res)=>{
    const{email,otp,newPassword}=req.body;
    if(!email||!otp||!newPassword){
        return res.json({success:false,message:"Please enter all the fields"})
    }
   

    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"The user with this email not available"})
        }
        if(user.resetOtp===""|| user.resetOtp!==otp){
            return res.json({success:false,message:"otp is not matching"})
        }
        if(user.restOtpExpireAt <Date.now()){
            return res.json({success:true,message:"OTP is expired"})
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.restOtp=""
        user.restOtpExpireAt=0
        await user.save()
        return res.json({success:true,message:"Password has been rest successfully"})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
}