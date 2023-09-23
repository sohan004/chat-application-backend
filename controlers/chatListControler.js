const mongoose = require('mongoose');

const chatListSchema = require('../models/chatListModels');
const accountSchema = require('../models/accountModels');
const chatSchema = require('../models/chatModels');

const UserAccount = mongoose.model('UserAccount', accountSchema);
const ChatList = mongoose.model('ChatList', chatListSchema);
const Chat = mongoose.model('Chat', chatSchema);


const chatListPost = async (req, res) => {
    try {
        const chatList = new ChatList({
            createUser: req.user.id,
            participent: req.body.participent,
            chatType: req.body.chatType,
        });

        const result = await chatList.save();

        res.send({ message: 'Chat created successfully', success: true, chatInfo: result });

    } catch (error) {
        console.log(error);

        res.send({ message: 'Chat created failed', success: false });

    }
}


const getAllChatLIst = async (req, res) => {
    try {
        const chatList = await ChatList.find({ $or: [{ createUser: req.user.id }, { participent: { $in: req.user.id } }] }).populate('createUser', 'name email profileImg').populate('participent', 'name email profileImg').populate('participent', 'name email profileImg').sort({ updatedAt: -1 });

        res.send({ message: 'Chat list found', success: true, chatList: chatList });

    } catch (error) {
        console.log(error);

        res.send({ message: 'Chat list not found', success: false });

    }
}



const searchUser = async (req, res) => {
    const text = req.params.text;
    const userList = await UserAccount.find({
        $or: [
            { name: { $regex: text, $options: "i" } },
            { email: { $regex: text, $options: "i" } }
        ]
    });

    res.send({ message: 'User list found', success: true, userList: userList });

}




const chatCreate = async (req, res) => {

    const findChatList = await ChatList.findById(req.body.chatId);

    try {

        if (await findChatList.createUser == req.user.id || await findChatList.participent.includes(req.user.id)) {

            const chat = await new Chat({
                sender: req.user.id,
                ...req.body
            });
            const result = await chat.save();

            findChatList.lastMessage = await req.body.message;
            findChatList.updatedAt = await new Date();
            await findChatList.save();

            res.send({ message: 'Chat created successfully', success: true, chatInfo: result });
        }
        else {
            res.send({ message: 'you are no authorized to create chat', success: false });
        }


    } catch (error) {
        res.send({ message: 'Chat not create', success: false });
    }
}


const getAllChat = async (req, res) => {
    try {
        const findChatList = await ChatList.findById(req.params.id);

        if (await findChatList.createUser == req.user.id || await findChatList.participent.includes(req.user.id)) {

            const chat = await Chat.find({ chatId: req.params.id }).sort({ createdAt: 1 });

            res.send({ message: 'Chat found', success: true, chat: chat });
        }
        else {
            res.send({ message: 'you are no authorized to get chat', success: false });
        }

    } catch (error) {
        res.send({ message: 'Chat not found', success: false });
    }
}

module.exports = { chatListPost, getAllChatLIst, searchUser, chatCreate, getAllChat }