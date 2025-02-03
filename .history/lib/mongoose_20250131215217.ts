import mongoose from "mongoose";

export function mongooseConnect() {
  const uri = process.env.MONGODB_URI;
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }
    return mongoose.connect(uri);
  }
}
