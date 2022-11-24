const {Schema, model} = require('mongoose');

const chatSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }]
});

module.exports = model('Chat', chatSchema);
