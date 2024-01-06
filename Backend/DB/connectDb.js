import mongoose from "mongoose";

export async function ConnectDB() {
  const conn = await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("mongoose connected");
    })
    .catch(() => {
      console.log("error while connecting to the mongoose ");
    });
}
