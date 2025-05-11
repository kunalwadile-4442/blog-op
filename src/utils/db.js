import mongoose from "mongoose";

let isConnected = false; // Track connection status

export async function connectDB() {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('DB connected successfully');
    } catch (error) {
        console.error('Error connecting to DB:', error);
        throw new Error("Database connection failed");
    }
}
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGO_URI;
// console.log("MONGODB_URI",MONGODB_URI)

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGO_URI environment variable");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) {
//     console.log("✅ Using cached database connection");
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     console.log("📡 Connecting to MongoDB...");
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//       dbName: "test",
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//     console.log("✅ MongoDB connected successfully");
//     return cached.conn;
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error);
//     throw new Error("Database connection failed");
//   }
// }