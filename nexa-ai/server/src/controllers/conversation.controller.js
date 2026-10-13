import conversationService from '../services/conversation.service.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all conversations for the authenticated user
 * @route   GET /api/conversations
 * @access  Private
 */
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await conversationService.getUserConversations(req.user._id);

  res.status(200).json({
    success: true,
    count: conversations.length,
    conversations,
  });
});

/**
 * @desc    Create a new conversation
 * @route   POST /api/conversations
 * @access  Private
 */
export const createConversation = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const conversation = await conversationService.createConversation(
    req.user._id,
    title || 'New Chat'
  );

  res.status(201).json({
    success: true,
    conversation,
  });
});

/**
 * @desc    Get a specific conversation by ID
 * @route   GET /api/conversations/:id
 * @access  Private
 */
export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await conversationService.getConversationById(
    req.params.id,
    req.user._id
  );

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found or unauthorized access.',
    });
  }

  res.status(200).json({
    success: true,
    conversation,
  });
});

/**
 * @desc    Update conversation title
 * @route   PATCH /api/conversations/:id
 * @access  Private
 */
export const updateConversation = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'A valid title is required.',
    });
  }

  const updatedConversation = await conversationService.updateConversationTitle(
    req.params.id,
    req.user._id,
    title
  );

  if (!updatedConversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found or unauthorized access.',
    });
  }

  res.status(200).json({
    success: true,
    conversation: updatedConversation,
  });
});

/**
 * @desc    Delete a conversation
 * @route   DELETE /api/conversations/:id
 * @access  Private
 */
export const deleteConversation = asyncHandler(async (req, res) => {
  const deleted = await conversationService.deleteUserConversation(
    req.params.id,
    req.user._id
  );

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found or unauthorized access.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Conversation deleted successfully.',
  });
});

export default {
  getConversations,
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
};
