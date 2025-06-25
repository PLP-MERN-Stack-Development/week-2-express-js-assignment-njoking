function auth(req, res, next) {
  const token = req.headers.authorization;
  if (token === 'Bearer secret-token') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid or missing token' });
  }
}

module.exports = auth;
