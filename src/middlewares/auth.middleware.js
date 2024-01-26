import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
export const verifyJWT = asyncHandler(async(req,res,next)=>{
   try {
   //  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")

 let token;

    // Check if the token is in cookies
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // Check if the token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }






    if (!token){
     throw new ApiError(401,"Unauthorized request")
    }
 console.log("Token88888888888888888888888888:", token);
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
   const user = await User.findById(decodedToken?._id).select
    ("-password -refreshToken").exec();
 
    if (!user){
     throw new ApiError(401,"invalid Access Token")
    }
 
    req.user =user;
    next()
   } catch (error) {
    throw new   ApiError(401,error?.message||"invalid acess token")
    
   }
})