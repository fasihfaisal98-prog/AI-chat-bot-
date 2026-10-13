import aiService from '../services/ai.service.js';
import conversationService from '../services/conversation.service.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Send a prompt to the AI and receive a response
 * @route   POST /api/chat
 * @access  Private
 */
export const handleChatMessage = asyncHandler(async (req, res) => {
  const { conversationId, message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required.',
    });
  }

  const promptText = message.trim();
  let conversation;
  let isNewConversation = false;

  // 1. Resolve or create target conversation
  if (conversationId && conversationId !== 'new') {
    conversation = await conversationService.getConversationById(
      conversationId,
      req.user._id
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or unauthorized.',
      });
    }
  } else {
    // New conversation creation
    isNewConversation = true;
    const initialTitle = await aiService.generateConversationTitle(promptText);
    conversation = await conversationService.createConversation(
      req.user._id,
      initialTitle
    );
  }

  // 2. Prepare user message payload
  const userMessage = {
    role: 'user',
    content: promptText,
    createdAt: new Date(),
  };

  // 3. Generate completion from AI Service using existing conversation history
  const assistantReplyText = await aiService.generateAIResponse(
    conversation.messages,
    promptText
  );

  const assistantMessage = {
    role: 'assistant',
    content: assistantReplyText,
    createdAt: new Date(),
  };

  // 4. Persist both user and assistant messages to database
  conversation = await conversationService.appendMessages(
    conversation._id,
    req.user._id,
    [userMessage, assistantMessage]
  );

  // If title was default 'New Chat' on existing conversation, optionally generate title
  if (conversation.title === 'New Chat' && conversation.messages.length <= 2) {
    const newTitle = await aiService.generateConversationTitle(promptText);
    conversation = await conversationService.updateConversationTitle(
      conversation._id,
      req.user._id,
      newTitle
    );
  }

  res.status(200).json({
    success: true,
    isNewConversation,
    conversationId: conversation._id,
    conversation,
    reply: assistantMessage,
  });
});

export default {
  handleChatMessage,
};
