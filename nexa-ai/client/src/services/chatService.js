import api from '../lib/api';

/**
 * Send a prompt message to the AI assistant.
 */
export const sendChatMessage = async (conversationId, message) => {
  const response = await api.post('/chat', {
    conversationId,
    message,
  });
  return response.data;
};

/**
 * Fetch all conversations of the logged-in user.
 */
export const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data.conversations;
};

/**
 * Fetch a single conversation with full message logs.
 */
export const getConversationById = async (id) => {
  const response = await api.get(`/conversations/${id}`);
  return response.data.conversation;
};

/**
 * Create a new blank conversation.
 */
export const createNewConversation = async (title = 'New Chat') => {
  const response = await api.post('/conversations', { title });
  return response.data.conversation;
};

/**
 * Rename a conversation title.
 */
export const renameConversation = async (id, title) => {
  const response = await api.patch(`/conversations/${id}`, { title });
  return response.data.conversation;
};

/**
 * Delete a conversation.
 */
export const removeConversation = async (id) => {
  const response = await api.delete(`/conversations/${id}`);
  return response.data;
};

export default {
  sendChatMessage,
  getConversations,
  getConversationById,
  createNewConversation,
  renameConversation,
  removeConversation,
};
