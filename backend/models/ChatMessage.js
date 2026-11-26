const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
  },
  matchedFAQ: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FAQ',
    default: null, // null when no relevant FAQ was found (unanswered)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for fast per-user chat history lookup sorted by newest first
chatMessageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
