const express = require('express');
const router = express.Router();
const passport = require('passport');
const chatController = require('../controllers/chat_controller');

// All chat routes require authentication
router.use(passport.checkAuthentication);

// Get friends list
router.get('/friends', chatController.getFriendsList);

// Get chat history with a specific friend
router.get('/history/:friendId', chatController.getChatHistory);

// Send a message
router.post('/send', chatController.sendMessage);

// Get unread message count (for notifications)
router.get('/unread-count', chatController.getUnreadCount);

module.exports = router; 