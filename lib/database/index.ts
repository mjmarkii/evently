// cache db connection across multiple invocations
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    // check if there is already a cached connection
    if (cached.conn) return cached.conn;

    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        );
    }

    // Otherwise create a new one
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'evently',
        bufferCommands: false,
    });

    cached.conn = await cached.promise;

    return cached.conn;
}

// Server actions