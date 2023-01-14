import mongoose from 'mongoose';

const connectToMongo = async () => {
    const mongoHost = process.env.MONGO_HOST;
    const mongoPort = process.env.MONGO_PORT;
    const user = process.env.MONGO_USER;
    const password = process.env.MONGO_PASS;

    mongoose.set('strictQuery', false);
    await mongoose.connect(`mongodb://${user}:${password}@${mongoHost}:${mongoPort}`);

    console.log('Connected to mongodb');
};

export default connectToMongo;