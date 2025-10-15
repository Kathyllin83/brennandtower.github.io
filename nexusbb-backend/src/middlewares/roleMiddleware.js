const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
    }

    next();
  };
};

module.exports = roleMiddleware;
