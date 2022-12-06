const {Schema, model} = require('mongoose');

const chatSchema = new Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }]
});

module.exports = model('Chat', chatSchema);
