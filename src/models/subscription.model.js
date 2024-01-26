import mongoose from "mongoose"

const subscriptionSchema = new Schema ({

    subscriber:{
        type:Schema.Types.objectId,
        ref:"User"
    },
    channel:{
        type:schema.Types.objectId,
        ref:"User"
    },
    


})


export const Subscription= mongoose.model("Subscription",
subscriptionSchema)
