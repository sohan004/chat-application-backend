const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { chatCreate , chatSeenUpdate} = require('../controlers/chatControlers');
const authorizationToken = require('../midelware/authorization');





router.post('/', authorizationToken, chatCreate);
router.put('/seenBy', authorizationToken, chatSeenUpdate);



module.exports = router;





