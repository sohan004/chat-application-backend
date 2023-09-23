const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const accoutRouter = require('./router/accountRouter');
const chatListRouter = require('./router/chatListRouter');
dotenv.config();

mongoose.connect(process.env.mongouri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});


// all route
app.use('/account', accoutRouter);
app.use('/chatlist', chatListRouter);


app.listen(port)