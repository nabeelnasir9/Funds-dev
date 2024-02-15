import mongoose from 'mongoose';

// Define a type for the connection object
type MongooseConnection = {
  isConnected?: number;
}

// Cache for the database connection to prevent multiple connections
const connection: MongooseConnection = {};

const dbConnect = async (): Promise<void> => {
  // If already connected, return early
  if (connection.isConnected) {
    return;
  }

  // Connect to the database
  const db = await mongoose.connect(process.env.MONGODB_URI as string);

  // Set isConnected to the MongoDB readyState
  connection.isConnected = db.connections[0].readyState;
};

export default dbConnect;
