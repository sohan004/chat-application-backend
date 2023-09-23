const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { chatListPost, getAllChatLIst, searchUser, getAllChat, chatCreate } = require('../controlers/chatListControler');
const authorizationToken = require('../midelware/authorization');



router.get('/', authorizationToken, getAllChatLIst);

router.get('/search/:text', authorizationToken, searchUser);

router.post('/', authorizationToken, chatListPost);

router.post('/chat', authorizationToken, chatCreate);

router.get('/chat/:id', authorizationToken, getAllChat);

router.put('/:id', (req, res) => { });

router.delete('/', (req, res) => { });


module.exports = router;