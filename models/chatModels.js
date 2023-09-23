const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const chatShema = new mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    sender: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    reciver: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});


module.exports = chatShema;