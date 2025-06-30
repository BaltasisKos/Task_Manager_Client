const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_here'; // Keep this consistent

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || '';

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
