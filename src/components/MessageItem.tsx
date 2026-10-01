import React, { useState } from 'react';
import { ChatMessage, ContactProfile, ThemeConfig } from '../types/chat';
import { ReadReceiptIcon } from './ReadReceiptIcon';
import { AudioWaveform } from './AudioWaveform';

interface MessageItemProps {
  message: ChatMessage;
  theme: ThemeConfig;
  recipient: ContactProfile;
  sender: ContactProfile;
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
      <div className="flex justify-center my-2.5 select-none">
        <span
          className="px-3 py-1 rounded-md text-[11px] font-medium tracking-tight shadow-sm"
          style={{
            backgroundColor: theme.isDarkMode ? '#1e2428' : '#e1f2fb',
            color: theme.isDarkMode ? '#8696a0' : '#54656f',
          }}
        >
          {message.text || 'Today'}
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

  const bubbleBg = isOutgoing ? theme.outgoingBubbleBg : theme.incomingBubbleBg;
  const textColor = isOutgoing ? theme.outgoingTextColor : theme.incomingTextColor;
  const timeColor = isOutgoing ? theme.outgoingTimeColor : theme.incomingTimeColor;

  const getFontClass = () => {
    if (theme.fontFamily === 'cursive') {
      return 'font-["Caveat",cursive] text-[17px] leading-tight';
    }
    if (theme.fontFamily === 'script') {
      return 'font-["Dancing_Script",cursive] text-[16px]';
    }
    if (theme.fontFamily === 'kalam') {
      return 'font-["Kalam",cursive] text-[14px]';
    }
    return 'font-normal text-[14px] leading-snug';
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
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl shadow-[0_1px_1px_rgba(0,0,0,0.18)] transition-all duration-150 ${
          isOutgoing
            ? 'rounded-tr-sm pr-3 pl-3 pt-1.5 pb-1.5'
            : 'rounded-tl-sm pr-3 pl-3 pt-1.5 pb-1.5'
        }`}
        style={{
          backgroundColor: bubbleBg,
          color: textColor,
        }}
      >
        {/* Top tail SVG */}
        {isOutgoing ? (
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
        )}

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
            {/* Outgoing Voice Note Profile Avatar Badge on Left */}
            {isOutgoing && (
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-purple-400 shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src={message.avatarBadgeUrl || sender.avatarUrl}
                    alt="Mic Badge"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 border border-white/20 flex items-center justify-center text-white">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Play Button */}
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

            {/* Audio Waveform & Duration */}
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

            {/* Incoming Voice Note Contact Avatar Badge on Right */}
            {!isOutgoing && (
              <div className="relative shrink-0 ml-1">
                <div className="w-9 h-9 rounded-full ring-1 ring-white/20 shadow-md overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src={message.avatarBadgeUrl || recipient.avatarUrl}
                    alt="Voice Sender"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-cyan-600 border border-white/20 flex items-center justify-center text-white">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. CHANNEL ADMIN INVITE CARD */}
        {message.type === 'channel_invite' && (
          <div className="flex flex-col gap-2 p-1 min-w-[260px] sm:min-w-[300px]">
            {/* Header with App Logo & Title */}
            <div className="flex items-center gap-3">
              {/* PalmPay / App Icon Circle */}
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

            {/* Status pill badge (e.g. Invite accepted) */}
            <div className="w-full py-1.5 px-3 rounded-lg bg-black/25 backdrop-blur-sm text-white/90 text-xs font-medium italic">
              {message.statusBadge || 'Invite accepted'}
            </div>

            {/* Description text */}
            <p className="text-[12.5px] italic text-white/95 leading-snug">
              {message.description}
            </p>

            {/* Timestamp & status */}
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
