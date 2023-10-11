"use strict";

var express = require('express');
var app = express();
var port = 3000;
var cors = require('cors');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var accoutRouter = require('./router/accountRouter');
var chatListRouter = require('./router/chatListRouter');
var chatRouter = require('./router/chatRouter');
var multer = require('multer');
var http = require('http');
dotenv.config();
mongoose.connect(process.env.mongouri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log('Connected to MongoDB...');
})["catch"](function (err) {
  return console.error('Could not connect to MongoDB...');
});
app.use(cors());
app.use(express.json());
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// all route
app.use('/account', accoutRouter);
app.use('/chatlist', chatListRouter);
app.use('/chat', chatRouter);
app.use('/uploads', express["static"]('uploads'));
app.use('/videos', express["static"]('videos'));
app.use('/chatFiles', express["static"]('chatFiles'));

//multer error handelaer
var errorHandler = function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.send({
      message: err.message,
      success: false
    });
  } else {
    res.send({
      message: err.message,
      success: false
    });
  }
};
app.use(errorHandler);
var server = app.listen(port, '192.168.0.108');
var io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
io.on('connection', function (socket) {
  console.log("User connected on socket");
  socket.on('seenByOn', function (data) {
    io.emit('seenBy', data);
    io.emit('seenBy2', data);
  });
  socket.on('typingOn', function (data) {
    io.emit('typing_start', data);
  });
  socket.on('typingOf', function (data) {
    io.emit('typing_end', data);
  });
});
global.io = io;
