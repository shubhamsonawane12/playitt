// import mongoose from "mongoose";
// import {DB_NAME} from "../constants.js";

// const connectDB = async ()=>{
//     try{

//         await mongoose.connect(process.env.MONGODB_URL,{
//             useNewUrlParser:true,
//             useUnifiedTopology:true,
//             dbName:DB_NAME,
//         });
// console.log(`\n MongoDB connect !!DB HOST: ${mongoose.connection.host}`);
//     }catch(error){
//         console.error("MONGODB connection error",error);
//         process.exit(1);
//     }
// }
// export default connectDB
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: DB_NAME,
    });
    console.log(`\n MongoDB connect !! DB HOST: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
