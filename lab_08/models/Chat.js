const {Schema, model} = require('mongoose');

const chatSchema = new Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }]
});

module.exports = model('Chat', chatSchema);
