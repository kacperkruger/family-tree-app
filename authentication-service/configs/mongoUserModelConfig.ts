import {model, Schema} from 'mongoose';

const mongoUserModelConfig = () => {
    model('User', new Schema());
};

export default mongoUserModelConfig;
