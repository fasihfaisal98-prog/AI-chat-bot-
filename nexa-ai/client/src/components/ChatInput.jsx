import React, { useRef, useEffect } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';

export const ChatInput = ({ input, setInput, onSend, isLoading }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea according to input content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <div className="relative flex items-end gap-2 bg-[#121622] border border-slate-700/70 focus-within:border-indigo-500/80 rounded-2xl p-2.5 shadow-lg shadow-black/40 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nexa AI anything... (e.g. Write a scalable auth flow)"
          rows={1}
          disabled={isLoading}
          className="w-full bg-transparent resize-none text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none max-h-48 py-1 px-1.5 leading-relaxed"
        />

        <button
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          aria-label="Send prompt"
          className="shrink-0 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <SendHorizontal className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="mt-2 text-center text-[11px] text-slate-500">
        Nexa AI can make mistakes. Verify critical code and system configurations.
      </div>
    </div>
  );
};

export default ChatInput;
