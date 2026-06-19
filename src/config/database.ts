import dns from "dns";
import mongoose from "mongoose";
import dotenvConfig from "./dotenv.config";

async function connectToDB() {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    const conn = await mongoose.connect(
      (dotenvConfig.MONGODB_URI as string) + "/devconnect"
    );
    console.log(`MongoDB Connected: ${conn.connection.name}`);
  } catch (error: any) {
    console.error(error?.message);
    throw new Error("DB Connection Failed");
  }

  console.log("Database connected");
}

export default connectToDB;
