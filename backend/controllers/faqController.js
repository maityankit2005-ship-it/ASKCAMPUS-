const FAQ = require('../models/FAQ');
const { FAQ_CATEGORIES } = require('../models/FAQ');

// @desc    Get all FAQs (supports ?category= and ?search=)
// @route   GET /api/faqs
// @access  Public
const getFAQs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    let faqs;
    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      // Try MongoDB text search first
      faqs = await FAQ.find(
        { ...filter, $text: { $search: trimmedSearch } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .populate('createdBy', 'name email');

      // Fallback to case-insensitive partial match if text search finds nothing
      if (faqs.length === 0) {
        const regex = new RegExp(trimmedSearch, 'i');
        faqs = await FAQ.find({
          ...filter,
          $or: [{ question: regex }, { answer: regex }],
        })
          .sort({ createdAt: -1 })
          .populate('createdBy', 'name email');
      }
    } else {
      faqs = await FAQ.find(filter)
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name email');
    }

    res.status(200).json({
      success: true,
      count: faqs.length,
      categories: FAQ_CATEGORIES,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single FAQ by ID
// @route   GET /api/faqs/:id
// @access  Public
const getFAQById = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!faq) {
      res.status(404);
      return next(new Error('FAQ not found'));
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer || !category) {
      res.status(400);
      return next(
        new Error('Please provide question, answer, and category')
      );
    }

    const faq = await FAQ.create({
      question,
      answer,
      category,
      createdBy: req.user._id,
    });

    const populated = await faq.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = async (req, res, next) => {
  try {
    const { question, answer, category } = req.body;
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      res.status(404);
      return next(new Error('FAQ not found'));
    }

    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (category !== undefined) faq.category = category;

    const updatedFAQ = await faq.save();
    await updatedFAQ.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: updatedFAQ,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      res.status(404);
      return next(new Error('FAQ not found'));
    }

    await faq.deleteOne();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};
