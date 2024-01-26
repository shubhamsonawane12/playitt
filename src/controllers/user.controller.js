import {asyncHandler}from "../utils/asynHandler.js" 
// import userRouter from "./routes/user.routes.js"
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from  "../utils/ApiResponse.js"


const genrateAcessTokenAndRefreshTokens = async(userId)=>{
try {
  const user =  await User.findById(userId)
   if (!user) {
      throw new ApiError(404, "User not found");
    }

 const accessToken = user.genrateAcessToken ()
 const refreshToken = user.genrateRefreshToken()

   console.log("Generated Tokens:", { accessToken, refreshToken });


  user.refreshToken = refreshToken;
 await  user.save({validateBeforeSave:false})
 return {accessToken,refreshToken}
} catch (error) {
  console.error("Error in token generation:", error.message);
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
}
};

const registerUser = asyncHandler(async(req,res)=>{
   
   const {fullName,email,username,password}=req.body
   console.log("email:", email);

   if ([fullName,email,username,password].some((field)=>
   field?.trim()=== "")
   ){
    throw new ApiError (400,"all fields are   required")
   }

const existedUser =  await User.findOne({

    $or:[{username},{email}]
})
if (existedUser){
    throw new ApiError (409,"User with email or username already exists ")
}

// const avatarLocalPath= req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files?.coverImage[0]?.path;

const avatarLocalPath = req.files?.avatar?.[0]?.path;
// const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
// const coverImageLocalPath = req.files && req.files.coverImage && req.files.coverImage[0] && req.files.coverImage[0].path;
 const coverImageLocalPath = req.files && req.files.coverImage && req.files.coverImage[0] && req.files.coverImage[0].path;
// let coverImageLocalPath;
// if (req.file && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ){
//     coverImageLocalPath =req.files.coverImage[0].path
// }



if (!avatarLocalPath){
    throw new ApiError(400,"Avatar file is require");

}


console.log("Avatar local path:", avatarLocalPath);
console.log("Cover image local path:", coverImageLocalPath);


const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);



if (!avatar){
    throw new ApiError(400,"Avatar file is required");
}
const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url||"",
    email,
    password,
    username:username.toLowerCase(),

})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
);
if(!createdUser){
    throw new ApiError (500,"something went wrong while registering user")
}
return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully")
)

} );

const loginUser = asyncHandler(async(req, res)=>{
  
  
    const {email,username, password}=req.body

    if (!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    
    const user = await User.findOne({
        $or:[{username},{email}]
    })


if(!user){
    throw new ApiError(404,"User does not exist")
}


const isPasswordValid = await user.isPasswordCorrect(password)
if (!isPasswordValid){
    throw new ApiError(401,"invalid user details ")
}

const {refreshToken,accessToken} = await genrateAcessTokenAndRefreshTokens (user._id);
console.log("Access Token and Refresh Token:", { accessToken, refreshToken });

const loggedInUser = await  User.findById(user._id).select('--password --refreshToken').exec();
//  console.log("Logged in user:", loggedInUser);
                // console.log("options: " ,opti)
const options ={
    httpOnly:true,
    secure:true
}
return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    
    new ApiResponse(
        200,{

            user: loggedInUser,
            accessToken,
            refreshToken,
          
        },
        "User logged in Suceessfully"
    ),
      console.log("logged user: " ,loggedInUser),
        console.log("token: " ,accessToken)
  

)
 

})
const logoutUser = asyncHandler(async(req,res)=>{
   User.findByIdAndDelete(
    req.user._id,{
        $set:{
            refreshToken: undefined
        }
    },{
        new:true
    }
   )
   const options ={
    httpOnly:true,
    secure:true
}
return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User logged out sucessfully"))
})

    
    const refreshAccessToken = asyncHandler (async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if (incomingRefreshToken){
        throw new ApiError(401,"unauthorized reuqest")
    }
    try {
    const decodedToken =jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?._id);
    
    if (!user){
        throw  new ApiError(401,"invalid refresh Token")
    }
    
    if (incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"refresh token is expire or used")
    }
    const options = {
    httpOnly:true,
    secure: true
    }
     const {accessToken,newRefreshToken} = await genrateAcessTokenAndRefreshTokens(user._id)
    
     return res.status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken:newRefreshToken},
            "Acess token refreshed"
        )
     )
     } catch (error) {
        throw new ApiError(401,error?.message||"invalid refresh token")
    
}
    })

export {    registerUser,
            logoutUser,
            loginUser,
            refreshAccessToken
};