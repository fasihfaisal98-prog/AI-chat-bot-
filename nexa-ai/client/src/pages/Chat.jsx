import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { Bot, Sparkles, AlertCircle, Code, ShieldCheck, Database, Zap } from 'lucide-react';

export const Chat = () => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isLoading]);

  // Load conversation history on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to load conversations:', err.message);
    }
  };

  // Switch active conversation
  const handleSelectConversation = async (id) => {
    if (id === currentConversationId) return;
    setErrorMessage(null);
    setCurrentConversationId(id);

    try {
      const conversation = await chatService.getConversationById(id);
      setCurrentConversation(conversation);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load conversation messages.');
    }
  };

  // Start a fresh conversation
  const handleNewChat = () => {
    setCurrentConversationId(null);
    setCurrentConversation(null);
    setErrorMessage(null);
    setInput('');
  };

  // Rename a conversation
  const handleRenameConversation = async (id, newTitle) => {
    try {
      const updated = await chatService.renameConversation(id, newTitle);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, title: updated.title } : c))
      );
      if (currentConversationId === id) {
        setCurrentConversation((prev) => ({ ...prev, title: updated.title }));
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to rename conversation.');
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (id) => {
    try {
      await chatService.removeConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (currentConversationId === id) {
        handleNewChat();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete conversation.');
    }
  };

  // Send prompt to AI
  const handleSendMessage = async (promptOverride) => {
    const messageToSend = (promptOverride || input).trim();
    if (!messageToSend || isLoading) return;

    setErrorMessage(null);
    setInput('');

    // Optimistic UI: Immediately show the user's message
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      createdAt: new Date().toISOString(),
    };

    setCurrentConversation((prev) => ({
      ...prev,
      messages: [...(prev?.messages || []), tempUserMsg],
    }));

    setIsLoading(true);

    try {
      const res = await chatService.sendChatMessage(
        currentConversationId,
        messageToSend
      );

      // If backend created a new conversation
      if (res.isNewConversation || !currentConversationId) {
        setCurrentConversationId(res.conversationId);
        setCurrentConversation(res.conversation);
        setConversations((prev) => [
          {
            _id: res.conversation._id,
            title: res.conversation.title,
            updatedAt: res.conversation.updatedAt,
          },
          ...prev,
        ]);
      } else {
        setCurrentConversation(res.conversation);
        // Move conversation to top in sidebar
        setConversations((prev) => [
          {
            _id: res.conversation._id,
            title: res.conversation.title,
            updatedAt: new Date().toISOString(),
          },
          ...prev.filter((c) => c._id !== res.conversation._id),
        ]);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error communicating with AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    {
      icon: <Code className="w-4 h-4 text-indigo-400" />,
      title: 'Architect Full-Stack App',
      description: 'Design a high-scale MERN architecture with Redis and worker queues',
      prompt: 'Design a production-grade MERN architecture with Redis caching and worker queues for high scale.',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: 'Harden Authentication',
      description: 'Implement JWT refresh tokens with rotation and HTTP-only cookies',
      prompt: 'Explain the best practices for implementing JWT refresh token rotation with HTTP-only cookies.',
    },
    {
      icon: <Database className="w-4 h-4 text-amber-400" />,
      title: 'MongoDB Schema Design',
      description: 'Optimize indexing and aggregation pipelines for rapid queries',
      prompt: 'What are the top performance indexing and schema design strategies for MongoDB?',
    },
    {
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      title: 'React Performance',
      description: 'Audit and resolve costly component re-renders and memory leaks',
      prompt: 'How do you detect and fix memory leaks and unnecessary re-renders in a complex React application?',
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0B0F17] overflow-hidden text-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#0B0F17] relative">
        <Header
          title={currentConversation?.title}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto">
          {!currentConversation || currentConversation.messages.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 mb-6">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What do you want to build today?
              </h2>
              <p className="text-sm text-slate-400 max-w-md mb-8">
                Nexa AI is your dedicated pair-programmer and system architect. Pick a prompt below or start typing.
              </p>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {starterPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3.5 rounded-xl bg-[#111522] hover:bg-[#161c2c] border border-slate-800 hover:border-slate-700 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 font-medium text-xs text-slate-200 group-hover:text-indigo-300">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Feed */
            <div className="divide-y divide-slate-800/40">
              {currentConversation.messages.map((msg, index) => (
                <ChatMessage
                  key={msg._id || index}
                  message={msg}
                  userName={user?.name}
                />
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="py-5 px-4 md:px-6 bg-[#0E131F]/50 border-y border-slate-800/30">
                  <div className="max-w-3xl mx-auto flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/20">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5 pt-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Chat Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Chat;
