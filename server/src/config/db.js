import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connection established with mongo db 🚀");
  } catch (error) {
    console.error("connection failed :", error.message);
    process.exit(-1);
  }
};
