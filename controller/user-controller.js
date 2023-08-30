import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../model/Usermodel.js";


export const signup = async (req,res,next)=>{
    const {username,email,password} = req.body;
    const hashPassword = bcryptjs.hashSync(password,10)
    const newUser = new User({username, email,password:hashPassword})

    try {
        await newUser.save()
        res.status(201).json({message:"user created"})
    } catch (error) {
        return console.log(error)
    }
     
}

export const signin = async (req,res,next)=>{
    const {email, password} = req.body

    try {
        const validUser = await User.findOne({email})
        if(!validUser){
            return res.status(404).json({message:'User not found'} )
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword){
            return next(errorHandler(401, 'wrong password'))
        }
        const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET)
        const expiryDate = new Date(Date.now()+3600000000)
        const {password:hashPassword, ...rest} = validUser._doc
        res.cookie('access_token', token, {httpOnly:true, expires:expiryDate}).status(200).json({rest,token})

    } catch (error) {
        return console.log(error)
    }
}


export const Logout = async(req,res,next)=>{
    
    try {
        res.clearCookie("access_token");
        return res.status(200).json({message:"loged out"})
    } catch (error) {
        return console.log(error)
    }
    
}