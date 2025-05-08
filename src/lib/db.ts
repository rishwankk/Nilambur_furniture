import mongoose from 'mongoose';

const connectDb = async (): Promise<void> => {
  try {
    // Ensure the MongoDB URI exists in the environment variables
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    // Connect to MongoDB with connection options to avoid deprecation warnings
    await mongoose.connect(mongoUri, {
     
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    // Error handling with type assertion to handle specific error properties
    if (error instanceof Error) {
      console.error('Error connecting to MongoDB:', error.message);
    } else {
      console.error('Unknown error while connecting to MongoDB');
    }
  }
};

export default connectDb;
