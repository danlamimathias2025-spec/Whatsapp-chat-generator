import React, { useState } from 'react';
import { AppPlatform, ChatMessage, ContactProfile, ThemeConfig } from '../types/chat';
import { ReadReceiptIcon } from './ReadReceiptIcon';
import { AudioWaveform } from './AudioWaveform';
import { ASSETS } from '../constants/presets';

interface MessageItemProps {
  message: ChatMessage;
  theme: ThemeConfig;
  recipient: ContactProfile;
  sender: ContactProfile;
  platform?: AppPlatform;
  onEdit?: (message: ChatMessage) => void;
  onDelete?: (id: string) => void;
  onToggleSender?: (id: string) => void;
  isFirstInGroup?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  theme,
  recipient,
  sender,
  platform = 'whatsapp',
  onEdit,
  onDelete,
  onToggleSender,
}) => {
  const isOutgoing = message.sender === 'user';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(
    message.type === 'voice_note' ? message.waveformProgress || 20 : 0
  );

  // Date Divider render
  if (message.type === 'date_divider') {
    return (
      <div className="flex justify-center my-2 select-none">
        <span
          className={`px-3.5 py-1 rounded-full text-[11.5px] font-medium tracking-tight shadow-sm ${
            platform === 'telegram'
              ? 'bg-[#181818]/90 text-slate-200 backdrop-blur-sm border border-white/5'
              : ''
          }`}
          style={
            platform === 'whatsapp'
              ? {
                  backgroundColor: theme.isDarkMode ? '#1e2428' : '#e1f2fb',
                  color: theme.isDarkMode ? '#8696a0' : '#54656f',
                }
              : undefined
          }
        >
          {message.text || 'Today'}
        </span>
      </div>
    );
  }

  // Telegram Join Service Pill
  if (message.type === 'telegram_join') {
    return (
      <div className="flex justify-center my-2 select-none">
        <span className="px-4 py-1.5 rounded-full text-[12px] font-medium tracking-tight bg-[#181818]/90 text-slate-200 border border-white/5 shadow-sm">
          {message.text || `${recipient.name} joined Telegram!`}
        </span>
      </div>
    );
  }

  // System Notice render
  if (message.type === 'system_notice') {
    return (
      <div className="flex justify-center my-2 px-6 select-none text-center">
        <div
          className="px-3.5 py-1.5 rounded-lg text-[11.5px] leading-relaxed shadow-sm max-w-sm flex items-start gap-1.5"
          style={{
            backgroundColor: theme.isDarkMode ? '#182229' : '#ffeecd',
            color: theme.isDarkMode ? '#ffd279' : '#534328',
          }}
        >
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          <span>{message.text}</span>
        </div>
      </div>
    );
  }

  // Dynamic bubble colors with per-message color override support
  const bubbleBg = isOutgoing
    ? message.bubbleColor || theme.outgoingBubbleBg
    : theme.incomingBubbleBg;
  const textColor = isOutgoing ? theme.outgoingTextColor : theme.incomingTextColor;
  const timeColor = isOutgoing ? theme.outgoingTimeColor : theme.incomingTimeColor;

  const getFontClass = () => {
    if (theme.fontFamily === 'cursive') {
      return 'font-["Caveat",cursive] text-[18px] leading-tight';
    }
    if (theme.fontFamily === 'script') {
      return 'font-["Dancing_Script",cursive] text-[16px]';
    }
    if (theme.fontFamily === 'kalam') {
      return 'font-["Kalam",cursive] text-[15px]';
    }
    return 'font-normal text-[14.5px] leading-snug';
  };

  return (
    <div
      className={`group/msg relative flex my-1 px-3 ${
        isOutgoing ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Quick Action Overlay on hover for easy editing */}
      <div
        className={`absolute -top-3 ${
          isOutgoing ? 'right-2' : 'left-2'
        } hidden group-hover/msg:flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-slate-700 shadow-xl z-30 opacity-0 group-hover/msg:opacity-100 transition-opacity`}
      >
        <button
          onClick={() => onToggleSender && onToggleSender(message.id)}
          title="Switch sender (Left <-> Right)"
          className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-xs flex items-center"
        >
          ⇄
        </button>
        <button
          onClick={() => onEdit && onEdit(message)}
          title="Edit Message"
          className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded text-xs flex items-center"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete && onDelete(message.id)}
          title="Delete Message"
          className="p-1 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded text-xs flex items-center"
        >
          ✕
        </button>
      </div>

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-150 ${
          platform === 'telegram'
            ? isOutgoing
              ? 'rounded-[18px] rounded-br-[4px] px-3.5 py-1.5'
              : 'rounded-[18px] rounded-bl-[4px] px-3.5 py-1.5'
            : isOutgoing
            ? 'rounded-2xl rounded-tr-sm pr-3 pl-3 pt-1.5 pb-1.5'
            : 'rounded-2xl rounded-tl-sm pr-3 pl-3 pt-1.5 pb-1.5'
        }`}
        style={{
          backgroundColor: bubbleBg,
          color: textColor,
        }}
      >
        {/* WhatsApp Top Tail SVG */}
        {platform === 'whatsapp' &&
          (isOutgoing ? (
            <svg
              className="absolute top-0 -right-[7px] w-[8px] h-[14px] pointer-events-none"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M0 0C2.5 0 7 0 7 0C7 0 7.5 4 4.5 8.5C1.5 13 0 14 0 14V0Z"
                fill={bubbleBg}
              />
            </svg>
          ) : (
            <svg
              className="absolute top-0 -left-[7px] w-[8px] h-[14px] pointer-events-none scale-x-[-1]"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M0 0C2.5 0 7 0 7 0C7 0 7.5 4 4.5 8.5C1.5 13 0 14 0 14V0Z"
                fill={bubbleBg}
              />
            </svg>
          ))}

        {/* Telegram Bottom Tail SVG */}
        {platform === 'telegram' &&
          (isOutgoing ? (
            <svg
              className="absolute -bottom-[0.5px] -right-[6px] w-[9px] h-[12px] pointer-events-none"
              viewBox="0 0 9 12"
              fill="none"
            >
              <path
                d="M0 0C0 4 3 10 9 12C4 12 0 12 0 12V0Z"
                fill={bubbleBg}
              />
            </svg>
          ) : (
            <svg
              className="absolute -bottom-[0.5px] -left-[6px] w-[9px] h-[12px] pointer-events-none scale-x-[-1]"
              viewBox="0 0 9 12"
              fill="none"
            >
              <path
                d="M0 0C0 4 3 10 9 12C4 12 0 12 0 12V0Z"
                fill={bubbleBg}
              />
            </svg>
          ))}

        {/* 1. TEXT MESSAGE */}
        {message.type === 'text' && (
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <span className={`${getFontClass()} break-words whitespace-pre-wrap`}>
              {message.text}
            </span>
            <div className="flex items-center gap-1 ml-auto self-end pl-2 pt-0.5 select-none">
              <span className="text-[10.5px] font-normal tracking-tight" style={{ color: timeColor }}>
                {message.time}
              </span>
              {isOutgoing && (
                <ReadReceiptIcon status={message.status} isStarred={message.isStarred} />
              )}
            </div>
          </div>
        )}

        {/* 2. VOICE NOTE MESSAGE */}
        {message.type === 'voice_note' && (
          <div className="flex items-center gap-2.5 py-1 min-w-[240px] max-w-full">
            {isOutgoing && (
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-purple-400 shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src={message.avatarBadgeUrl || sender.avatarUrl || ASSETS.purpleMicBadge}
                    alt="Mic Badge"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/95 hover:text-white transition-transform active:scale-95 shrink-0"
              style={{
                backgroundColor: isOutgoing ? 'transparent' : 'rgba(255,255,255,0.15)',
              }}
              aria-label="Play Voice Note"
            >
              {isPlayingAudio ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="flex-1 flex flex-col justify-center min-w-0">
              <AudioWaveform
                progress={audioProgress}
                onSeek={(pct) => setAudioProgress(pct)}
                activeColor={isOutgoing ? '#ffffff' : '#38bdf8'}
                inactiveColor={
                  isOutgoing ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)'
                }
              />
              <div className="flex items-center justify-between mt-0.5 text-[10.5px]">
                <span className="font-mono tracking-tight" style={{ color: timeColor }}>
                  {message.duration || '0:12'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="tracking-tight" style={{ color: timeColor }}>
                    {message.time}
                  </span>
                  {isOutgoing && (
                    <ReadReceiptIcon status={message.status} isStarred={message.isStarred} />
                  )}
                </div>
              </div>
            </div>

            {!isOutgoing && (
              <div className="relative shrink-0 ml-1">
                <div className="w-9 h-9 rounded-full ring-1 ring-white/20 shadow-md overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src={message.avatarBadgeUrl || recipient.avatarUrl}
                    alt="Voice Sender"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. CHANNEL ADMIN INVITE CARD */}
        {message.type === 'channel_invite' && (
          <div className="flex flex-col gap-2 p-1 min-w-[260px] sm:min-w-[300px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white text-purple-900 flex flex-col items-center justify-center shadow-inner shrink-0 p-1">
                <svg className="w-5 h-5 text-purple-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-[8px] font-bold tracking-tighter text-slate-800">palmpay</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[14px] text-white tracking-wide truncate">
                  {message.channelName || 'LEGIT 🤑 UPDATES ✅✅✅'}
                </span>
                <span className="text-[11px] text-white/70 italic">
                  {message.subtitle || 'Channel admin invite'}
                </span>
              </div>
            </div>
            <div className="w-full py-1.5 px-3 rounded-lg bg-black/25 backdrop-blur-sm text-white/90 text-xs font-medium italic">
              {message.statusBadge || 'Invite accepted'}
            </div>
            <p className="text-[12.5px] italic text-white/95 leading-snug">
              {message.description}
            </p>
            <div className="flex items-center justify-end gap-1 pt-1 select-none">
              <span className="text-[10.5px] tracking-tight" style={{ color: timeColor }}>
                {message.time}
              </span>
              {isOutgoing && (
                <ReadReceiptIcon status={message.status} isStarred={message.isStarred} />
              )}
            </div>
          </div>
        )}

        {/* 4. IMAGE MESSAGE */}
        {message.type === 'image' && (
          <div className="flex flex-col gap-1.5 p-0.5">
            <div className="rounded-xl overflow-hidden max-w-sm max-h-72 bg-slate-900">
              <img
                src={message.imageUrl}
                alt="Attachment"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {message.caption && (
              <p className={`${getFontClass()} px-1 pt-1`}>{message.caption}</p>
            )}
            <div className="flex items-center justify-end gap-1 pr-1 pb-0.5 select-none">
              <span className="text-[10.5px] tracking-tight" style={{ color: timeColor }}>
                {message.time}
              </span>
              {isOutgoing && (
                <ReadReceiptIcon status={message.status} isStarred={message.isStarred} />
              )}
            </div>
          </div>
        )}

        {/* 5. DOCUMENT MESSAGE */}
        {message.type === 'document' && (
          <div className="flex flex-col gap-2 p-1 min-w-[220px]">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-black/20">
              <div className="w-9 h-10 rounded bg-red-600/90 flex flex-col items-center justify-center text-white shrink-0 shadow">
                <span className="text-[9px] font-bold uppercase">{message.fileType || 'PDF'}</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold truncate text-white">
                  {message.fileName || 'Document.pdf'}
                </span>
                <span className="text-[10px] text-white/60">{message.fileSize || '1.2 MB'}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 select-none">
              <span className="text-[10.5px]" style={{ color: timeColor }}>
                {message.time}
              </span>
              {isOutgoing && (
                <ReadReceiptIcon status={message.status} isStarred={message.isStarred} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
