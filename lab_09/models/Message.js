const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = model('Message', messageSchema);
