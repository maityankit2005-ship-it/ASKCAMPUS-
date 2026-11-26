const FAQ = require('../models/FAQ');
const ChatMessage = require('../models/ChatMessage');

// Call external AI API using Fetch API when AI_API_KEY is configured
const generateAIAnswer = async (studentQuestion, matchedFAQs) => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }

  const apiUrl =
    process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  const faqContext = matchedFAQs
    .map(
      (faq, idx) =>
        `FAQ ${idx + 1} (${faq.category}):\nQ: ${faq.question}\nA: ${faq.answer}`
    )
    .join('\n\n');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content:
            'You are AskCampus, a helpful college FAQ assistant. Answer the student clearly and concisely using only the provided college FAQ context. Keep the tone friendly and beginner-friendly.',
        },
        {
          role: 'user',
          content: `Student Question: ${studentQuestion}\n\nRelevant College FAQs:\n${faqContext}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API returned status ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  return content || null;
};

// Search FAQs using MongoDB text search, with keyword regex fallback
const findRelevantFAQs = async (questionText) => {
  let matches = await FAQ.find(
    { $text: { $search: questionText } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(3);

  if (matches.length === 0) {
    const words = questionText
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
      .filter((w) => w.length >= 3);

    if (words.length > 0) {
      const regex = new RegExp(words.join('|'), 'i');
      matches = await FAQ.find({
        $or: [{ question: regex }, { answer: regex }, { category: regex }],
      }).limit(3);
    }
  }

  return matches;
};

// @desc    Ask a question to the AI FAQ assistant
// @route   POST /api/chat/ask
// @access  Private (Student or Admin)
const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      res.status(400);
      return next(new Error('Please enter a question'));
    }

    const cleanQuestion = question.trim();
    const matchedFAQs = await findRelevantFAQs(cleanQuestion);

    let finalAnswer = '';
    let matchedFAQId = null;
    let source = 'no-match';

    if (matchedFAQs.length > 0) {
      const topMatch = matchedFAQs[0];
      matchedFAQId = topMatch._id;

      // Try AI generation first if API key is set; otherwise fall back to DB answer
      try {
        const aiReply = await generateAIAnswer(cleanQuestion, matchedFAQs);
        if (aiReply) {
          finalAnswer = aiReply;
          source = 'ai';
        }
      } catch (aiError) {
        console.warn('AI service unavailable, using database fallback:', aiError.message);
      }

      if (!finalAnswer) {
        finalAnswer = topMatch.answer;
        source = 'database-fallback';
      }
    } else {
      finalAnswer =
        "I couldn't find a matching answer in the campus FAQ database yet. Your question has been logged for the college admin team to review and add to our FAQs.";
      source = 'no-match';
    }

    const chatMessage = await ChatMessage.create({
      userId: req.user._id,
      question: cleanQuestion,
      answer: finalAnswer,
      matchedFAQ: matchedFAQId,
    });

    await chatMessage.populate('matchedFAQ', 'question category');

    res.status(201).json({
      success: true,
      source,
      data: chatMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res, next) => {
  try {
    const history = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('matchedFAQ', 'question category');

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single chat message by ID (only owner can view)
// @route   GET /api/chat/history/:id
// @access  Private
const getChatHistoryById = async (req, res, next) => {
  try {
    const message = await ChatMessage.findById(req.params.id).populate(
      'matchedFAQ',
      'question answer category'
    );

    if (!message) {
      res.status(404);
      return next(new Error('Chat message not found'));
    }

    // Students can only view their own chat history
    if (
      message.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      return next(new Error('Not authorized to view this chat message'));
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askQuestion,
  getChatHistory,
  getChatHistoryById,
};
