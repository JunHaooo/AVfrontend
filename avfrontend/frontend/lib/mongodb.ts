import mongoose from "mongoose"

// Type for cached mongoose connection
type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extend Node.js global type
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

// Initialize cached connection
const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
}

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

// Connect to MongoDB (runtime only)
export async function connectMongo(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable")
    }

    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
