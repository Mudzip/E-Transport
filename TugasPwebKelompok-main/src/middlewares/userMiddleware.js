// Middleware sederhana untuk mock user
exports.injectUser = (req, res, next) => {
  // Assign user ID tetap selama development
  req.userId = 'user-123';
  next();
};
