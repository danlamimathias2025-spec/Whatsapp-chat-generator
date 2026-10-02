import React from 'react';
import { ContactProfile, ThemeConfig } from '../types/chat';

interface TelegramHeaderProps {
  recipient: ContactProfile;
  theme: ThemeConfig;
  onAvatarClick?: () => void;
  onNameClick?: () => void;
}

export const TelegramHeader: React.FC<TelegramHeaderProps> = ({
  recipient,
  theme,
  onAvatarClick,
  onNameClick,
}) => {
  return (
    <div
      className="w-full px-3 py-2 flex items-center justify-between z-20 select-none transition-colors duration-200"
      style={{
        backgroundColor: theme.headerBg,
        color: '#ffffff',
      }}
    >
      {/* Left zone: Circular Back Button */}
      <button
        type="button"
        className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 flex items-center justify-center text-white/90 transition-colors shrink-0 shadow-sm"
        aria-label="Back"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* Middle zone: Telegram Rounded Contact Capsule */}
      <div
        className="flex-1 mx-2 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 shadow-sm cursor-pointer min-w-0"
        onClick={onNameClick}
      >
        {/* Recipient Avatar */}
        <div
          className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 ring-1 ring-white/10 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            if (onAvatarClick) onAvatarClick();
          }}
        >
          {recipient.avatarUrl ? (
            <img
              src={recipient.avatarUrl}
              alt={recipient.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase">
              {recipient.name.slice(0, 2) || 'TG'}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-[13.5px] font-bold text-white truncate leading-tight">
            {recipient.name || 'Name'}
          </span>
          <span className="text-[11px] text-slate-400 italic truncate leading-tight">
            {recipient.statusText || 'last seen recently'}
          </span>
        </div>
      </div>

      {/* Right zone: Telegram Action Capsule (Phone + 3-dots) */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-slate-900/80 border border-white/10 shadow-sm shrink-0">
        <button
          type="button"
          className="text-white/90 hover:text-white transition-colors"
          aria-label="Call"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>

        <button
          type="button"
          className="text-white/90 hover:text-white transition-colors"
          aria-label="More options"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="12" cy="19" r="1.75" />
          </svg>
        </button>
      </div>
    </div>
  );
};
