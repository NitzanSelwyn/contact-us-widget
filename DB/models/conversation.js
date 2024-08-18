const mongoose = require('mongoose');
const uuid = require('uuid').v4;


const MessageSchema = new mongoose.Schema({
    type: { type: String, required: true },
    content: { type: String, required: true },
    fileName: { type: String },
    fileType: { type: String },
    userId: { type: String, required: true },
    creationTime: { type: Date, default: Date.now }
});

const conversationsSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    Id: { type: String, default: uuid, required: false },
    creationTime: { type: Date, default: Date.now },
    messages: [MessageSchema]
});

const Convo = mongoose.model('Conversations', conversationsSchema);

module.exports = Convo;
