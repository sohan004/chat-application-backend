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

        if (req.body.chatType == 'private') {
            const check = await ChatList.findOne({ $and: [{ createUser: req.user.id }, { participent: { $in: req.body.participent } }] });
            const check2 = await ChatList.findOne({ $and: [{ participent: { $in: [req.user.id] } }, { createUser: { $in: req.body.participent } }] });

            if (check || check2) {
                res.send({ message: 'Chat already created', success: true, chatInfo: check || check2 });
                return;
            }
        }


        const result = await chatList.save();
        const chatLIst = await ChatList.findById(result._id).populate('createUser', '-password').populate('participent', '-password').populate('lastMessage');

        await global.io.emit('newChatListCreate', { chatInfo: chatLIst });

        res.send({ message: 'Chat created successfully', success: true, chatInfo: result });

    } catch (error) {
        console.log(error);

        res.send({ message: 'Chat created failed', success: false });

    }
}


const createGroup = async (req, res) => {
    const fileName = req.file?.filename;
    const body = JSON.parse(req.body.jsonData);
    try {
        const createGrp = new ChatList({
            createUser: req.user.id,
            participent: body.participent,
            chatType: 'group',
            groupName: body.groupName,
            groupImg: fileName,
        });
        const result = await createGrp.save();
        const chatLIst = await ChatList.findById(result._id).populate('createUser', '-password').populate('participent', '-password').populate('lastMessage');
        res.send({ message: 'Group created successfully', success: true, chatInfo: chatLIst });
    } catch (error) {
        console.log(error);
        res.send({ message: 'Group created failed', success: false });
    }
}


const getAllChatLIst = async (req, res) => {
    try {
        const chatList = await ChatList.find({ $or: [{ createUser: req.user.id }, { participent: { $in: req.user.id } }] }).populate('createUser', '-password').populate('participent', '-password').populate('lastMessage').sort({ updatedAt: -1 });

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
    }).select('-password')

    res.send({ message: 'User list found', success: true, userList: userList });

}




const getAllChat = async (req, res) => {
    try {
        const findChatList = await ChatList.findById(req.params.id).populate('createUser', '-password').populate('participent', '-password');


        if (await findChatList?.createUser?._id == req.user.id || await findChatList.participent.find(parti => parti._id == req.user.id)) {

            const chat = await Chat.find({ chatId: req.params.id }).sort({ createdAt: -1 }).skip(+req?.query?.skip).limit(15)
            const dateSort = chat.sort((a, b) => a.createdAt - b.createdAt)

            res.send({
                message: 'Chat found',
                chatId: req.params.id,
                createUserDetails: findChatList.createUser,
                participentDetails: findChatList.participent,
                success: true,
                chat: dateSort
            });
        }
        else {
            res.send({ message: 'you are no authorized to get chat', success: false });
        }

    } catch (error) {
        res.send({ message: 'Chat not found', success: false });
    }
}

module.exports = { chatListPost, getAllChatLIst, searchUser, getAllChat, createGroup }