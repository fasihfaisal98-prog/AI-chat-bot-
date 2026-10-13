import express from 'express';
import rateLimit from 'express-rate-limit';
import { handleChatMessage } from '../controllers/ai.controller.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Rate limiter for AI generation to protect API quota and prevent abuse
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI requests created from this IP, please try again after a minute.',
  },
});

router.post('/', protect, aiLimiter, handleChatMessage);

export default router;
