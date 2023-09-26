const express = require('express');
const accountSchema = require('../models/accountModels');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const router = express.Router();
const multerupload = require('../midelware/multer');
const deletPhoto = require('../midelware/deletPhoto');

const UserAccount = mongoose.model('UserAccount', accountSchema);





const userGet = async (req, res) => {

    const token = req.header('Authorization');

    try {
        const decoded = await jwt.verify(token, process.env.jwtPrivateKey);

        if (!decoded) return res.status(400).send({ message: 'Invalid token.', success: false });

        // if (!decoded) return res.status(400).send({ message: 'Invalid token.', success: false });

        const findUser = await UserAccount.findOne({ _id: decoded.id }).select('-password');
        if (!findUser) return res.status(400).send({ message: 'Email not registered.', success: false });

        // console.log(decoded);

        res.send({ message: 'User found', success: true, userInfo: findUser });

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Invalid token.', success: false });

    }


};


const forgetPassword = async (req, res) => {
    const findUser = await UserAccount.findOne({ email: req.body.email });
    if (!findUser) return res.status(400).send({ message: 'Email not registered.', success: false });

    const validPassword = await bcrypt.compare(req.body.password, findUser.password)

    if (!validPassword) return res.status(400).send({ message: 'Old  Password Invalid.', success: false });

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.newPassword, salt);
    const result = await UserAccount.findByIdAndUpdate({ _id: findUser._id }, { password: hash });


    res.send({ message: 'Password changed successfully', success: true });

}


const userSign = async (req, res) => {
    const findUser = await UserAccount.findOne({ email: req.body.email });
    if (!findUser) return res.status(400).send({ message: 'Email not registered.', success: false });

    const validPassword = await bcrypt.compare(req.body.password, findUser.password);
    if (!validPassword) return res.status(400).send({ message: 'Invalid password.', success: false });

    const token = await jwt.sign({ id: findUser._id, email: findUser.email }, process.env.jwtPrivateKey, { expiresIn: '120h' });
    await res.send({
        message: 'Login successfully',
        success: true,
        token: token,
        userInfo: {
            _id: findUser._id,
            name: findUser.name,
            profileImg: findUser?.profileImg,
            email: findUser.email,
        }
    });


};



const userPost = async (req, res) => {
    const imgFileName = req.file?.filename;
    const jsonData = JSON.parse(req.body.jsonData);

    const findUser = await UserAccount.findOne({ email: jsonData.email });
    if (findUser) {
        if (imgFileName) deletPhoto(imgFileName);
        return res.status(400).send({ message: 'Email already registered.', success: false });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(jsonData.password, salt);



    try {
        const user = await new UserAccount({
            name: jsonData.name,
            profileImg: imgFileName,
            email: jsonData.email,
            password: hash,
        });
        const result = await user.save();
        res.send({ message: 'User created successfully', success: true });
    } catch (err) {
        if (imgFileName) deletPhoto(imgFileName);
        res.send(err.message);
    }
};




const userPut = async (req, res) => {

    if (req.user.id != req.params.id) return res.status(400).send({ message: 'You not authorized to update.', success: false });



    const findUser = UserAccount.findById(req.params.id);
    if (!findUser) return res.status(400).send({ message: 'User not found.', success: false });

    const updateUser = await UserAccount.findByIdAndUpdate(req.params.id, { $set: { ...req.body, updatedAt: new Date() } }, { new: true, upsert: true });
    if (!updateUser) return res.status(400).send({ message: 'User not updated.', success: false });


    // console.log(updateUser);
    res.send({ message: 'User updated successfully', success: true });
};


const userDelete = async (req, res) => { };


module.exports = { userGet, userSign, userPost, userPut, userDelete, forgetPassword }