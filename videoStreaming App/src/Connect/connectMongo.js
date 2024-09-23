import mongoose from 'mongoose'


const connectMongoDB=async()=>{
    try{
    const connectionInstace=await mongoose.connect(`${process.env.MONGO_URL}`);

    if(!connectionInstace){
        throw new Error("something went wrong while connecting to the DB");
    }
}
catch(error){
    throw error;
}
}
export {connectMongoDB}