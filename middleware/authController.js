const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET = process.env.JWT_SECRET;

// POST /signin
const signin = (req, res) => {
  const { username, password } = req.body;

  if (username === 'deific-digital' && password === 'tracker@2025') {
    const token = jwt.sign({ username }, SECRET); // optional expiration
    console.log('Generated JWT Token:', token);
    return res.json({ message: 'Sign-in successful', token });
  }

  res.status(401).json({ message: 'Invalid username or password' });
};

// Middleware: Authorization
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Authorization token is required.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { signin, authenticateToken };

///generated token
// token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlaWZpYy1kaWdpdGFsIiwiaWF0IjoxNzQ0MTAxODU3fQ.L3mOXk0NLLzWcykHXsnSO33mak7KHkJn7iYOhGKAfKY
