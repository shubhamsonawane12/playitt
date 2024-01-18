import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    try{
        app.on("error",(error)=>{
            console.log("Error",error);
            throw error
        })
        app.listen(process.env.PORT || 8000,()=>{
        console.log(` server is running on port ${process.env.PORT}`);
    })

    }
    catch(error){
        console.log("port listening failed ",error);

    }
    



})

.catch ((error)=>{
    console.log("mongodb connection failed",error);
})













// import mongoose from "mongoose"
// import {DB_NAME} from "./constants"
// import express from "express"

// const app = express()
// (async ()=> {
// try {
//    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//      app.on("error",(error)=>{
//         console.log("ERROR: ",error);
//         throw error
//      })
//      app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${PORT}`)
//      })

// } catch(error) {
//     console.error("ERROR: ",error)
//     throw err
// } 

// })()