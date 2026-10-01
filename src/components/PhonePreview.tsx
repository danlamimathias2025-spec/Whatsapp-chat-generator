import React, { forwardRef, useEffect, useRef } from 'react';
import {
  AppPlatform,
  ChatMessage,
  ContactProfile,
  DeviceFrameConfig,
  StatusBarConfig,
  ThemeConfig,
  WallpaperConfig,
  WatermarkConfig,
} from '../types/chat';
import { StatusBar } from './StatusBar';
import { ChatHeader } from './ChatHeader';
import { TelegramHeader } from './TelegramHeader';
import { MessageItem } from './MessageItem';
import { ChatInputBar } from './ChatInputBar';

interface PhonePreviewProps {
  messages: ChatMessage[];
  recipient: ContactProfile;
  sender: ContactProfile;
  statusBar: StatusBarConfig;
  theme: ThemeConfig;
  wallpaper: WallpaperConfig;
  deviceFrame: DeviceFrameConfig;
  watermark?: WatermarkConfig;
  platform?: AppPlatform;
  zoom?: number;
  onEditMessage?: (message: ChatMessage) => void;
  onDeleteMessage?: (id: string) => void;
  onToggleSender?: (id: string) => void;
  onSendMessage?: (text: string, sender: 'user' | 'recipient') => void;
  onHeaderAvatarClick?: () => void;
  onHeaderNameClick?: () => void;
}

export const PhonePreview = forwardRef<HTMLDivElement, PhonePreviewProps>(
  (
    {
      messages,
      recipient,
      sender,
      statusBar,
      theme,
      wallpaper,
      deviceFrame,
      watermark,
      platform = 'whatsapp',
      zoom = 1,
      onEditMessage,
      onDeleteMessage,
      onToggleSender,
      onSendMessage,
      onHeaderAvatarClick,
      onHeaderNameClick,
    },
    ref
  ) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when messages update
    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, [messages.length]);

    return (
      <div
        className="flex items-center justify-center p-4 transition-transform duration-150"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Device Outer Frame (e.g. Phone Bezel) */}
        <div
          className={`relative transition-all duration-200 ${
            deviceFrame.showDeviceBezels
              ? 'p-3 bg-slate-900/95 rounded-[44px] ring-1 ring-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
              : 'rounded-2xl shadow-2xl overflow-hidden'
          }`}
        >
          {/* Top Speaker / Dynamic Island notch if iPhone */}
          {deviceFrame.showDeviceBezels && deviceFrame.type === 'iphone' && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-end px-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/50" />
            </div>
          )}

          {/* Top Camera punchhole if Galaxy */}
          {deviceFrame.showDeviceBezels && deviceFrame.type === 'galaxy' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-40 border border-slate-800" />
          )}

          {/* Screenshot Target Canvas Container */}
          <div
            ref={ref}
            id="chat-canvas-target"
            className="relative w-[380px] sm:w-[412px] h-[780px] flex flex-col overflow-hidden bg-slate-950 font-sans select-none rounded-[32px]"
            style={{
              backgroundColor: theme.chatBg,
            }}
          >
            {/* 1. Custom Wallpaper Layer */}
            {wallpaper.imageUrl && (
              <div
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-200"
                style={{
                  background: wallpaper.imageUrl.includes('gradient')
                    ? wallpaper.imageUrl
                    : `url(${wallpaper.imageUrl})`,
                  opacity: wallpaper.opacity,
                  filter: `blur(${wallpaper.blur}px)`,
                  transform: `scale(${wallpaper.zoom})`,
                }}
              />
            )}

            {/* Dark/Light Dimmer Overlay */}
            <div
              className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-200"
              style={{
                backgroundColor: theme.isDarkMode ? '#000000' : '#ffffff',
                opacity: wallpaper.darkness,
              }}
            />

            {/* 2. Top System Status Bar */}
            <StatusBar config={statusBar} />

            {/* 3. Chat Header (WhatsApp or Telegram) */}
            {platform === 'telegram' ? (
              <TelegramHeader
                recipient={recipient}
                theme={theme}
                onAvatarClick={onHeaderAvatarClick}
                onNameClick={onHeaderNameClick}
              />
            ) : (
              <ChatHeader
                recipient={recipient}
                theme={theme}
                onAvatarClick={onHeaderAvatarClick}
                onNameClick={onHeaderNameClick}
              />
            )}

            {/* 4. Scrollable Chat Messages Content */}
            <div
              ref={scrollContainerRef}
              className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    💬
                  </div>
                  <p className="text-sm font-medium text-slate-300">No messages yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Use the controls on the left or type below to craft your conversation.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <MessageItem
                    key={msg.id || index}
                    message={msg}
                    theme={theme}
                    recipient={recipient}
                    sender={sender}
                    platform={platform}
                    onEdit={onEditMessage}
                    onDelete={onDeleteMessage}
                    onToggleSender={onToggleSender}
                  />
                ))
              )}
            </div>

            {/* 5. Bottom Chat Input Bar */}
            <ChatInputBar
              theme={theme}
              onSendMessage={onSendMessage}
              activeSender="user"
            />

            {/* Watermark Overlay */}
            {watermark?.enabled && watermark.text && (
              <div
                className={`absolute z-30 pointer-events-none font-bold tracking-wider select-none px-2.5 py-1 rounded-md bg-black/20 backdrop-blur-[2px] text-white/90 shadow-sm ${
                  watermark.position === 'bottom-right'
                    ? 'bottom-16 right-4'
                    : watermark.position === 'bottom-left'
                    ? 'bottom-16 left-4'
                    : watermark.position === 'top-right'
                    ? 'top-16 right-4'
                    : watermark.position === 'top-left'
                    ? 'top-16 left-4'
                    : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                }`}
                style={{
                  opacity: watermark.opacity,
                  fontSize: `${watermark.fontSize}px`,
                }}
              >
                {watermark.text}
              </div>
            )}

            {/* Optional Device Home Bar */}
            {deviceFrame.showNavigationBar && (
              <div className="w-full flex items-center justify-center py-1 pb-2 z-20">
                <div className="w-32 h-1 rounded-full bg-white/40" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PhonePreview.displayName = 'PhonePreview';
