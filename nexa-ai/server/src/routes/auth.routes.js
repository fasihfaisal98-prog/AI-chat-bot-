import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/auth.controller.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../validators/auth.validator.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
