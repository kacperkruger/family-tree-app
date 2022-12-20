import mongoose from 'mongoose';
import mongodbConnData from '../configs/mongodbConnData';

const connectToMongo = async () => {
    mongoose.set('strictQuery', false);
    await mongoose
        .connect(mongodbConnData.uri);
    console.log('Connected to mongodb');
};

export default connectToMongo;