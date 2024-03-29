const mongoose = require('mongoose');

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
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('broadcast', broadcastSchema);