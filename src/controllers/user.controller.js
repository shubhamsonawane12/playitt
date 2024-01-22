import {asyncHandler}from "../utils/asynHandler.js" 
// import userRouter from "./routes/user.routes.js"



const registerUser = asyncHandler(async(req,res)=>{
    try{res.status(200).json({
        message:"ok",
    });
    }catch(error){
    console.log('shubham errorris: ',error)
}
} );





export {registerUser};