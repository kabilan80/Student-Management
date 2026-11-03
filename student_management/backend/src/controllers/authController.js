const passport = require('passport');
const { User } = require('../models');
const { wrap } = require('../middleware');

const register = wrap(async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({ name: String(name || '').trim(), email: email || '', password: password || '' });
  res.status(201).json({ message: 'Registered successfully' });
});

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Invalid email or password' });
    req.login(user, (loginErr) => (loginErr ? next(loginErr) : res.json(user.toPublic())));
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  });
};

const me = (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not logged in' });
  res.json(req.user.toPublic());
};

module.exports = { register, login, logout, me };