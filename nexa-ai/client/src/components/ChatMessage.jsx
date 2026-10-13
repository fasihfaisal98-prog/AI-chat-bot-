import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check } from 'lucide-react';

const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && (match || codeText.includes('\n'))) {
    return (
      <div className="my-3 rounded-lg overflow-hidden border border-slate-700/60 bg-[#0A0D14]">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#121622] text-xs font-mono text-slate-400 border-b border-slate-700/50">
          <span>{language || 'code'}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] hover:text-slate-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="p-3 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200">
          <pre className="!bg-transparent !p-0 !m-0">
            <code>{codeText}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <code
      className="bg-slate-800/80 text-indigo-300 px-1.5 py-0.5 rounded text-[13px] font-mono border border-slate-700/40"
      {...props}
    >
      {children}
    </code>
  );
};

export const ChatMessage = ({ message, userName }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`py-5 px-4 md:px-6 transition-colors ${
        isAssistant ? 'bg-[#0E131F]/50 border-y border-slate-800/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isAssistant ? (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Bot className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200 uppercase">
              {userName ? userName[0] : <User className="w-4 h-4" />}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              {isAssistant ? 'Nexa AI' : userName || 'You'}
            </span>
            <span className="text-[10px] text-slate-500">
              {message.createdAt
                ? new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </span>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-slate-200 text-sm leading-relaxed break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline"
                  />
                ),
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-indigo-500 pl-3 italic text-slate-400 my-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
