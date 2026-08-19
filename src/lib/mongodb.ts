import { MongoClient, Db } from 'mongodb';

const password = encodeURIComponent('MrCoder04]');
const defaultUri = `mongodb+srv://pjsofonic_db_user:${password}@sofo-change-hub.shztxpa.mongodb.net/sofo-change-hub?retryWrites=true&w=majority`;

const uri = process.env.MONGODB_URI || defaultUri;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;
let isConnected = false;

export async function getMongoClient(): Promise<MongoClient | null> {
  if (isConnected && client) {
    return client;
  }

  try {
    if (!clientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      clientPromise = client.connect();
    }
    const connectedClient = await clientPromise;
    isConnected = true;
    return connectedClient;
  } catch (err: any) {
    console.warn('[MongoDB Atlas Notice] Connection issue, using resilient store:', err.message);
    clientPromise = null;
    client = null;
    isConnected = false;
    return null;
  }
}

export async function getMongoDb(): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  return mongoClient.db('sofo-change-hub');
}
