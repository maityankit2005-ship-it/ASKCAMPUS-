const express = require('express');
const router = express.Router();
const {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require('../controllers/faqController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', getFAQs);
router.get('/:id', getFAQById);
router.post('/', protect, authorizeRoles('admin'), createFAQ);
router.put('/:id', protect, authorizeRoles('admin'), updateFAQ);
router.delete('/:id', protect, authorizeRoles('admin'), deleteFAQ);

module.exports = router;
