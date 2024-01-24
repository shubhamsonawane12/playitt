import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// const uploadOnCloudinary = async (localFilePath)=>{
//     try{

//         if (!localFilePath) return error("loacal file path was not found")
//          //upload the file on cloudinary 
//        const response = await cloudinary.uploader.upload(localFilePath,{
//             resource_type:"auto"
//         })
//         //file has been uploaded successfull 
//         console.log("file is uploaded on cloudinary",response.url);
//         return response ;

//     }catch (error){
//         fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed
//     return null;
//     }
// }


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("Local file path is undefined");
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // console.log("File is uploaded on Cloudinary", response.url);
       fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Error in uploading to Cloudinary:", error);
        if (localFilePath) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (fsError) {
                console.error("Error in removing local file:", fsError);
            }
        }
        return null;
    }
};


// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });



export {uploadOnCloudinary}
