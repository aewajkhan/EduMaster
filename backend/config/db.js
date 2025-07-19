import mongoose from "mongoose";

export const dbConnection=async()=>{
    try {
        const connection=mongoose.connect(process.env.MONGOURI)
        
if(connection){
    console.log("mongoDB connected Successfully...")
    return connection
}

    } catch (error) {
        console.log(error)
    }
}