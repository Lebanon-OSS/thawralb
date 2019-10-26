const mongoose = require('mongoose ');

const broadcastSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    useTimestamps: true
});

module.exports = mongoose.Schema('broadcast', broadcastSchema);