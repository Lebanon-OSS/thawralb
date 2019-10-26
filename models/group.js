const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    userCreated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('group', groupSchema);