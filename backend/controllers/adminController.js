const User = require('../models/User');
const FAQ = require('../models/FAQ');
const ChatMessage = require('../models/ChatMessage');

// @desc    Get admin dashboard overview statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalFAQs,
      totalQuestions,
      unansweredQuestions,
      recentQuestions,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      FAQ.countDocuments(),
      ChatMessage.countDocuments(),
      ChatMessage.countDocuments({ matchedFAQ: null }),
      ChatMessage.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email')
        .populate('matchedFAQ', 'question category'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFAQs,
        totalQuestions,
        unansweredQuestions,
        recentQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin analytics reports using MongoDB aggregation pipelines
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAdminReports = async (req, res, next) => {
  try {
    // 1. Most frequently asked FAQs
    const mostAskedFAQs = await ChatMessage.aggregate([
      { $match: { matchedFAQ: { $ne: null } } },
      {
        $group: {
          _id: '$matchedFAQ',
          askCount: { $sum: 1 },
        },
      },
      { $sort: { askCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'faqs',
          localField: '_id',
          foreignField: '_id',
          as: 'faq',
        },
      },
      { $unwind: '$faq' },
      {
        $project: {
          _id: 0,
          faqId: '$_id',
          question: '$faq.question',
          category: '$faq.category',
          askCount: 1,
        },
      },
    ]);

    // 2. Most popular FAQ categories based on student questions
    const popularCategories = await ChatMessage.aggregate([
      { $match: { matchedFAQ: { $ne: null } } },
      {
        $lookup: {
          from: 'faqs',
          localField: 'matchedFAQ',
          foreignField: '_id',
          as: 'faq',
        },
      },
      { $unwind: '$faq' },
      {
        $group: {
          _id: '$faq.category',
          totalQuestions: { $sum: 1 },
        },
      },
      { $sort: { totalQuestions: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalQuestions: 1,
        },
      },
    ]);

    // 3. Total questions asked per student
    const questionsByStudent = await ChatMessage.aggregate([
      {
        $group: {
          _id: '$userId',
          questionCount: { $sum: 1 },
          unansweredCount: {
            $sum: { $cond: [{ $eq: ['$matchedFAQ', null] }, 1, 0] },
          },
        },
      },
      { $sort: { questionCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: 0,
          studentId: '$_id',
          name: '$student.name',
          email: '$student.email',
          questionCount: 1,
          unansweredCount: 1,
        },
      },
    ]);

    // 4. Total FAQs per category
    const faqsByCategory = await FAQ.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        mostAskedFAQs,
        popularCategories,
        questionsByStudent,
        faqsByCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unanswered student questions
// @route   GET /api/admin/unanswered
// @access  Private/Admin
const getUnansweredQuestions = async (req, res, next) => {
  try {
    const unanswered = await ChatMessage.find({ matchedFAQ: null })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: unanswered.length,
      data: unanswered,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAdminReports,
  getUnansweredQuestions,
};
