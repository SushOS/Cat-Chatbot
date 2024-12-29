const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat/initialize', chatController.initializeChat.bind(chatController));
router.post('/chat/message', chatController.sendMessage.bind(chatController));
router.get('/cats/breeds', chatController.getBreeds.bind(chatController));
router.post('/chat/stream', chatController.streamMessage.bind(chatController));

module.exports = router;