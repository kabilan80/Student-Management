// Wraps async route handlers so thrown errors reach the error handler.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Please log in to continue' });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    const errors = Object.fromEntries(err.errors.map((e) => [e.path, e.message]));
    return res.status(400).json({ message: err.errors.map((e) => e.message).join(', '), errors });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path;
    return res.status(409).json({ message: field === 'email' ? 'Email already exists' : 'This record already exists' });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Invalid student or course' });
  }
  console.error(err);
  res.status(500).json({ message: 'Server error' });
};

module.exports = { wrap, requireAuth, errorHandler };