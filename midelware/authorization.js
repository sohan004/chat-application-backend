const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');



const authorizationToken = async (req, res, next) => {
      const token = req.header('Authorization');
        if (!token) return res.status(401).send({ message: 'Access denied. No token provided.', success: false });
        try {
            const decoded = await jwt.verify(token, 'UtD24dEPXK9D6cvRdZDY09KPSvbUHW9EaBzajxR0TtLWlpLh1IqzZBufv0C9Vdq0lAE39KwcHJCapUT');
            if (!decoded) return res.status(400).send({ message: 'Invalid token.', success: false });
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(400).send({ message: 'Invalid token.', success: false });
        }
};

module.exports = authorizationToken;