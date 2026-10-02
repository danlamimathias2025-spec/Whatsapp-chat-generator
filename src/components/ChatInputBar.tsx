import React, { useState, useRef } from 'react';
import { ThemeConfig } from '../types/chat';

interface ChatInputBarProps {
  theme: ThemeConfig;
  onSendMessage?: (text: string, sender: 'user' | 'recipient') => void;
  onSendImage?: (imageUrl: string, sender: 'user' | 'recipient') => void;
  activeSender?: 'user' | 'recipient';
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  theme,
  onSendMessage,
  onSendImage,
  activeSender = 'user',
}) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.trim()) {
      e.preventDefault();
      if (onSendMessage) {
        onSendMessage(inputText.trim(), activeSender);
      }
      setInputText('');
    }
  };

  const handleSendClick = () => {
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText.trim(), activeSender);
      setInputText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && onSendImage) {
          onSendImage(event.target.result as string, activeSender);
        }
      };
      reader.readAsDataURL(file);
    }
    // Clear selection so the same image can be reselected if needed
    e.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full px-2 py-2 flex items-center gap-2 select-none z-20">
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Pill Input Container */}
      <div
        className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-full shadow-md backdrop-blur-sm transition-colors duration-150"
        style={{
          backgroundColor: theme.inputBarBg,
          color: theme.inputTextColor,
        }}
      >
        {/* Emoji Button */}
        <button
          type="button"
          className="text-slate-400 hover:text-white transition-colors shrink-0"
          aria-label="Emoji Picker"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-500 min-w-0"
          style={{ color: theme.inputTextColor }}
        />

        {/* Attachment Paperclip Button */}
        <button
          type="button"
          onClick={triggerUpload}
          className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0 -rotate-45 cursor-pointer"
          aria-label="Attach File"
          title="Upload / Send Image"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Camera Button (hidden if typing) */}
        {!inputText && (
          <button
            type="button"
            onClick={triggerUpload}
            className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
            aria-label="Camera"
            title="Upload / Send Image"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
        )}
      </div>

      {/* Mic / Send Action Circle Button */}
      <button
        type="button"
        onClick={handleSendClick}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 shrink-0"
        style={{
          backgroundColor: theme.accentColor || '#9d32b5',
        }}
        aria-label={inputText ? 'Send message' : 'Record voice note'}
      >
        {inputText ? (
          /* Send icon */
          <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        ) : (
          /* WhatsApp Mic icon */
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>
    </div>
  );
};
