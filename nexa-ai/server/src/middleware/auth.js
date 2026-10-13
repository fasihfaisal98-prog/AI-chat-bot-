import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication middleware.
 * Verifies JWT token from HTTP-only cookie or Bearer Authorization header,
 * verifies payload, and attaches authenticated user document to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check HTTP-only cookie first (preferred browser security)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Bearer token header for REST API clients / Postman
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to access this resource.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid session token. Please log in again.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error occurred.',
    });
  }
};

export default protect;
