const express = require('express');
const router = express.Router();
const { userGet, userSign, userPost, userPut, userDelete, forgetPassword } = require('../controlers/accountContolers');



router.get('/', userGet);  //--

router.post('/forget', forgetPassword);

router.post('/sign', userSign); //--

router.post('/', userPost); //--

router.put('/:id', userPut);

router.delete('/', userDelete);



module.exports = router;