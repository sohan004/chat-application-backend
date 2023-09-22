const express = require('express');
const accountSchema = require('../models/accountModels');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const UserAccount = mongoose.model('UserAccount', accountSchema);



const userGet = async (req, res) => {

    try {
        const decoded = await jwt.verify(req.headers['authorization'], process.env.jwtPrivateKey);

        const findUser = await UserAccount.findOne({ _id: decoded.id }).select('-password');
        if (!findUser) return res.status(400).send({ message: 'Email not registered.', success: false });

        // console.log(decoded);

        res.send({ message: 'User found', success: true, userInfo: findUser });

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Invalid token.', success: false });

    }


};


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
            profileImg: findUser.profileImg,
            email: findUser.email,
        }
    });


};



const userPost = async (req, res) => {

    const findUser = await UserAccount.findOne({ email: req.body.email });
    if (findUser) return res.status(400).send({ message: 'Email already registered.', success: false });

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password, salt);


    const user = await new UserAccount({
        name: req.body.name,
        profileImg: req.body.profileImg,
        email: req.body.email,
        password: hash,
    });
    try {
        const result = await user.save();
        res.send({ message: 'User created successfully', success: true });
    } catch (err) {
        res.send(err.message);
    }
};




const userPut = async (req, res) => { };
const userDelete = async (req, res) => { };


module.exports = { userGet, userSign, userPost, userPut, userDelete }