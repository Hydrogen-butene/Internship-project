
import jwt from "jsonwebtoken"


const isAuthenticatedUser = async(req, res, next) =>{
    const extractedToken = req.headers.authorization.split(" ")[1] // Bearer token
    if(!extractedToken && extractedToken.trim() === ""){
        return res.status(404).json({message:"Token not found"})
    }
    jwt.verify(extractedToken, process.env.JWT_SECRET,(err, decrypted)=>{
        if(err){
            return res.status(400).json({message:`${err.message}`})
        }
        return
    })
    next();
};


export default isAuthenticatedUser;
