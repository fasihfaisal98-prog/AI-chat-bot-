import express from 'express';
import {
  getConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
} from '../controllers/conversation.controller.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All conversation routes require an authenticated user
router.use(protect);

router.route('/')
  .get(getConversations)
  .post(createConversation);

router.route('/:id')
  .get(getConversation)
  .patch(updateConversation)
  .delete(deleteConversation);

export default router;
