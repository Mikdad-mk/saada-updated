import { MongoClient } from "mongodb";

if (typeof window !== "undefined") {
  throw new Error("lib/mongodb.ts should never be imported on the client side");
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/saada-students-union";

// Debug: Log the URI being used (remove this in production)
console.log("MongoDB URI:", uri);

// Validate URI format
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  throw new Error(`Invalid MongoDB URI format: ${uri}. Must start with 'mongodb://' or 'mongodb+srv://'`);
}

// MongoDB connection options with better error handling
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPromise = client.connect();
    } catch (error) {
      console.error("Failed to create MongoDB client:", error);
      throw error;
    }
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  } catch (error) {
    console.error("Failed to create MongoDB client:", error);
    throw error;
  }
}

// Add error handling for the connection
clientPromise.catch((error) => {
  console.error("MongoDB connection error:", error);
  console.log("Please make sure MongoDB is running and accessible at:", uri);
});

export default clientPromise; 