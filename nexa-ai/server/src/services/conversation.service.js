import Conversation from '../models/Conversation.js';

/**
 * Fetch all conversations belonging to the authenticated user.
 * Sorted by latest update.
 */
export const getUserConversations = async (userId) => {
  return Conversation.find({ user: userId })
    .select('title createdAt updatedAt messages')
    .sort({ updatedAt: -1 })
    .lean();
};

/**
 * Retrieve a specific conversation by ID with strict ownership validation.
 */
export const getConversationById = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  });

  return conversation;
};

/**
 * Create a new conversation for a user.
 */
export const createConversation = async (userId, title = 'New Chat') => {
  const conversation = await Conversation.create({
    user: userId,
    title,
    messages: [],
  });

  return conversation;
};

/**
 * Append messages to an existing conversation.
 */
export const appendMessages = async (conversationId, userId, newMessages = []) => {
  const conversation = await Conversation.findOneAndUpdate(
    { _id: conversationId, user: userId },
    {
      $push: { messages: { $each: newMessages } },
    },
    { new: true, runValidators: true }
  );

  return conversation;
};

/**
 * Update the title of a conversation.
 */
export const updateConversationTitle = async (conversationId, userId, title) => {
  return Conversation.findOneAndUpdate(
    { _id: conversationId, user: userId },
    { title: title.trim() },
    { new: true, runValidators: true }
  );
};

/**
 * Delete a user's conversation.
 */
export const deleteUserConversation = async (conversationId, userId) => {
  return Conversation.findOneAndDelete({
    _id: conversationId,
    user: userId,
  });
};

export default {
  getUserConversations,
  getConversationById,
  createConversation,
  appendMessages,
  updateConversationTitle,
  deleteUserConversation,
};
