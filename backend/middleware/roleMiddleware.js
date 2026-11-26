// Restrict route access to specific user roles (e.g., 'admin', 'student')
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Access denied: requires ${allowedRoles.join(' or ')} role`)
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };
