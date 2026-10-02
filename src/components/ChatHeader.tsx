import React from 'react';
import { ContactProfile, ThemeConfig } from '../types/chat';

interface ChatHeaderProps {
  recipient: ContactProfile;
  theme: ThemeConfig;
  onAvatarClick?: () => void;
  onNameClick?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  recipient,
  theme,
  onAvatarClick,
  onNameClick,
}) => {
  const getFontFamilyClass = (font: string) => {
    switch (font) {
      case 'cursive':
      case 'script':
        return 'font-["Dancing_Script",cursive] text-lg font-bold tracking-wide';
      case 'caveat':
        return 'font-["Caveat",cursive] text-xl font-bold';
      case 'kalam':
        return 'font-["Kalam",cursive] text-base font-bold';
      case 'roboto':
        return 'font-["Roboto",sans-serif] text-base font-semibold';
      default:
        return 'font-["Plus_Jakarta_Sans",sans-serif] text-base font-semibold';
    }
  };

  return (
    <div
      className="w-full px-3 py-2 flex items-center justify-between z-20 shadow-sm select-none border-b border-white/5 transition-colors duration-200"
      style={{
        backgroundColor: theme.headerBg,
        color: '#ffffff',
      }}
    >
      {/* Left section: Back Arrow + Avatar + Info */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Back Arrow Button */}
        <button
          type="button"
          className="p-1 -ml-1 text-white/90 hover:text-white rounded-full transition-colors flex items-center justify-center shrink-0"
          aria-label="Back"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        {/* Recipient Profile Avatar */}
        <div
          className="relative cursor-pointer group shrink-0"
          onClick={onAvatarClick}
          title="Click to edit avatar"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 ring-1 ring-white/10 flex items-center justify-center">
            {recipient.avatarUrl ? (
              <img
                src={recipient.avatarUrl}
                alt={recipient.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-sm font-bold text-white uppercase">
                {recipient.name.slice(0, 2) || 'WA'}
              </span>
            )}
          </div>
          {recipient.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          )}
        </div>

        {/* Contact Name & Subtitle */}
        <div
          className="flex flex-col min-w-0 cursor-pointer group pl-1"
          onClick={onNameClick}
          title="Click to edit name"
        >
          <div className="flex items-center gap-1.5 leading-tight">
            <span
              className={`truncate text-white ${getFontFamilyClass(recipient.nameFont)}`}
            >
              {recipient.name || 'Name'}
            </span>
            {recipient.isVerified && (
              <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
          </div>

          {recipient.statusText ? (
            <span className="text-[11px] text-emerald-400/90 truncate">
              {recipient.statusText}
            </span>
          ) : recipient.isOnline ? (
            <span className="text-[11px] text-emerald-400 font-medium">online</span>
          ) : recipient.isBusiness ? (
            <span className="text-[10px] text-slate-400 font-normal truncate">
              Business Account
            </span>
          ) : null}
        </div>
      </div>

      {/* Right section: Action Buttons (Video call, Phone call, Menu) */}
      <div className="flex items-center gap-4 text-white/90 shrink-0 pr-1">
        {/* Video Call Icon */}
        <button
          type="button"
          className="hover:text-white transition-colors"
          aria-label="Video Call"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </button>

        {/* Voice Call Icon */}
        <button
          type="button"
          className="hover:text-white transition-colors"
          aria-label="Voice Call"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>

        {/* 3 Dots Menu Icon */}
        <button
          type="button"
          className="hover:text-white transition-colors"
          aria-label="Menu"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="12" cy="19" r="1.75" />
          </svg>
        </button>
      </div>
    </div>
  );
};
