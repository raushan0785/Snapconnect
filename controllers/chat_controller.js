const Chat = require('../models/chat');
const User = require('../models/user');

// Send a message
module.exports.sendMessage = async function(req, res) {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        // Check if they are friends
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender.friends.includes(receiverId)) {
            return res.status(403).json({ error: 'You can only message your friends' });
        }

        // Create the message
        const newMessage = await Chat.create({
            sender: senderId,
            receiver: receiverId,
            message: message
        });

        return res.redirect('back');
    } catch (err) {
        console.log('Error sending message:', err);
        return res.redirect('back');
    }
};

// Get chat history with a specific friend
module.exports.getChatHistory = async function(req, res) {
    try {
        const { friendId } = req.params;
        const userId = req.user.id;

        // Check if they are friends
        const user = await User.findById(userId);
        if (!user.friends.includes(friendId)) {
            return res.status(403).json({ error: 'You can only chat with your friends' });
        }

        // Get messages between these two users
        const messages = await Chat.find({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        })
        .populate('sender', 'name')
        .populate('receiver', 'name')
        .sort('createdAt');

        // Mark messages as read
        await Chat.updateMany(
            { sender: friendId, receiver: userId, isRead: false },
            { isRead: true }
        );

        const friend = await User.findById(friendId);
        
        return res.render('chat', {
            title: `Chat with ${friend.name}`,
            messages: messages,
            friend: friend,
            user: req.user
        });
    } catch (err) {
        console.log('Error getting chat history:', err);
        return res.redirect('back');
    }
};

// Get friends list for chat
module.exports.getFriendsList = async function(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('friends', 'name');

        return res.render('friends_list', {
            title: 'Friends',
            friends: user.friends,
            user: req.user
        });
    } catch (err) {
        console.log('Error getting friends list:', err);
        return res.redirect('back');
    }
};

// Get unread message count
module.exports.getUnreadCount = async function(req, res) {
    try {
        const userId = req.user.id;
        const unreadCount = await Chat.countDocuments({
            receiver: userId,
            isRead: false
        });

        return res.json({ unreadCount });
    } catch (err) {
        console.log('Error getting unread count:', err);
        return res.json({ unreadCount: 0 });
    }
}; 