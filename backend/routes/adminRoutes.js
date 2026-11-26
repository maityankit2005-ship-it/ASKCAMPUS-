const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAdminReports,
  getUnansweredQuestions,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All admin routes require authentication and admin role
router.use(protect, authorizeRoles('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/reports', getAdminReports);
router.get('/unanswered', getUnansweredQuestions);

module.exports = router;
