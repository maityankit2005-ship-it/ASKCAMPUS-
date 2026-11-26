const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getChatHistory,
  getChatHistoryById,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askQuestion);
router.get('/history', protect, getChatHistory);
router.get('/history/:id', protect, getChatHistoryById);

module.exports = router;
