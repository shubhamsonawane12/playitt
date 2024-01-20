import  mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({


    video:{
        type:String, //cloudinary url
        required:true,

    },
    thumbnail:{
        type:String, //cloudinary url
        required:true,

    },
   title:{
        type:String, //cloudinary url
        required:true,

    },
      description:{
        type:String, //cloudinary url
        required:true,

    },
    duration:{
        type:number , //cloudnary url
        rquired:true,

    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }
    ,

   owner:{
    type: Schema.Types.objectId,
    ref:"User"
   }


},{timestamp:true})
videoSchema.plugin(mongooseAggregatePaginate)

export const Video =mongoose("Video",videoSchema)