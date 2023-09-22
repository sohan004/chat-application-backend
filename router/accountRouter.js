const express = require('express');
const router = express.Router();
const { userGet, userSign, userPost, userPut, userDelete } = require('../controlers/accountContolers');



router.get('/', userGet);

router.post('/sign', userSign);

router.post('/', userPost);

router.put('/', userPut);

router.delete('/', userDelete);



module.exports = router;