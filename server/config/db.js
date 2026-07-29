import mongoose from "mongoose"

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("db connected!!");
    } catch (error) {
        console.log("db connection error:", error);
    }
}
export default  connectDB;
