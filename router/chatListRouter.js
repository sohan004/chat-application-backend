const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { chatListPost, getAllChatLIst, searchUser, getAllChat } = require('../controlers/chatListControler');
const authorizationToken = require('../midelware/authorization');
const multerupload = require('../midelware/multer');



router.get('/', authorizationToken, getAllChatLIst);

router.get('/search/:text', authorizationToken, searchUser);

router.post('/', authorizationToken, chatListPost);



router.get('/chat/:id', authorizationToken, getAllChat);

router.put('/:id', (req, res) => { });

router.delete('/', (req, res) => { });




module.exports = router;