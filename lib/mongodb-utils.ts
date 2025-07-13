import { MongoClient, Db } from "mongodb";

// Simple MongoDB connection utility that avoids problematic dependencies
export class MongoDBConnection {
  private static instance: MongoDBConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<MongoClient> {
    if (this.client) {
      return this.client;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    try {
      this.client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      await this.client.connect();
      console.log("MongoDB connected successfully");
      return this.client;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async getDb(): Promise<Db> {
    if (!this.db) {
      const client = await this.connect();
      this.db = client.db();
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log("MongoDB disconnected");
    }
  }

  public isConnected(): boolean {
    return this.client !== null;
  }
}

// Export a singleton instance
export const mongoConnection = MongoDBConnection.getInstance();

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  return await mongoConnection.getDb();
}

// Helper function to get collection
export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
} 