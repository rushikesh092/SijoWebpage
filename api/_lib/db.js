import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!globalThis.__mongooseConn) {
  globalThis.__mongooseConn = null;
}

export const connectDb = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (globalThis.__mongooseConn) {
    return globalThis.__mongooseConn;
  }

  globalThis.__mongooseConn = await mongoose.connect(MONGODB_URI, {
    dbName: process.env.MONGODB_DB || "luxe_bath_kitchen"
  });

  return globalThis.__mongooseConn;
};
