const express = require('express');
const router = express.Router();
const { userGet, userSign, userPost, userPut, userDelete, forgetPassword } = require('../controlers/accountContolers');
const authorizationToken = require('../midelware/authorization');
const { upload } = require('../midelware/multer');



router.get('/', userGet);  //--

router.post('/forget', forgetPassword);

router.post('/sign', userSign); //--

router.post('/', upload.single('image'), userPost); //--

router.put('/:id', authorizationToken, userPut);

router.delete('/', authorizationToken, userDelete);



module.exports = router;