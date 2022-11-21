const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: String,
    registrationDate: Date,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

module.exports = model('User', userSchema);
