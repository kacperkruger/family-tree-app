import mongoose from 'mongoose';
import fetchMongoDbConnData from '../configs/mongodbConnData';

const connectToMongo = async () => {
    const mongodbConnData = fetchMongoDbConnData();
    mongoose.set('strictQuery', false);
    await mongoose
        .connect(mongodbConnData.uri, {
            user: mongodbConnData.user,
            pass: mongodbConnData.password
        });
    console.log('Connected to mongodb');
};

export default connectToMongo;