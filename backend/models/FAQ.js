const mongoose = require('mongoose');

const FAQ_CATEGORIES = [
  'Admissions',
  'Fees and Scholarships',
  'Examinations',
  'Attendance',
  'Timetables',
  'Placements',
  'Campus Facilities',
  'Events',
];

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide a question'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters'],
  },
  answer: {
    type: String,
    required: [true, 'Please provide an answer'],
    trim: true,
    minlength: [5, 'Answer must be at least 5 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: FAQ_CATEGORIES,
      message: 'Invalid FAQ category',
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index on question and answer for MongoDB text search
faqSchema.index({ question: 'text', answer: 'text' });

module.exports = mongoose.model('FAQ', faqSchema);
module.exports.FAQ_CATEGORIES = FAQ_CATEGORIES;
