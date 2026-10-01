import React, { useState } from 'react';
import {
  AppPlatform,
  ChatMessage,
  ContactProfile,
  DeviceFrameConfig,
  StatusBarConfig,
  ThemeConfig,
  WallpaperConfig,
} from '../types/chat';
import {
  ASSETS,
  THEMES,
  TELEGRAM_THEMES,
  OTHER_PRESETS,
} from '../constants/presets';

interface ControlPanelProps {
  platform: AppPlatform;
  setPlatform: (platform: AppPlatform) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  recipient: ContactProfile;
  setRecipient: React.Dispatch<React.SetStateAction<ContactProfile>>;
  sender: ContactProfile;
  setSender: React.Dispatch<React.SetStateAction<ContactProfile>>;
  statusBar: StatusBarConfig;
  setStatusBar: React.Dispatch<React.SetStateAction<StatusBarConfig>>;
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  wallpaper: WallpaperConfig;
  setWallpaper: React.Dispatch<React.SetStateAction<WallpaperConfig>>;
  deviceFrame: DeviceFrameConfig;
  setDeviceFrame: React.Dispatch<React.SetStateAction<DeviceFrameConfig>>;
  onOpenMessageModal: (message?: ChatMessage, defaultSender?: 'user' | 'recipient') => void;
  onLoadReferencePreset: () => void;
  onLoadTelegramReferencePreset: () => void;
  referenceImageUrl?: string;
  telegramReferenceImageUrl?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  platform,
  setPlatform,
  messages,
  setMessages,
  recipient,
  setRecipient,
  sender,
  setSender,
  statusBar,
  setStatusBar,
  theme,
  setTheme,
  wallpaper,
  setWallpaper,
  deviceFrame,
  setDeviceFrame,
  onOpenMessageModal,
  onLoadReferencePreset,
  onLoadTelegramReferencePreset,
}) => {
  const [activeTab, setActiveTab] = useState<
    'messages' | 'profiles' | 'status' | 'theme' | 'compare'
  >('messages');

  // Drag & drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...messages];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);
    setMessages(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveMessage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= messages.length) return;
    const updated = [...messages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMessages(updated);
  };

  const handleDuplicateMessage = (index: number) => {
    const original = messages[index];
    const clone: ChatMessage = {
      ...original,
      id: `msg-${Date.now()}`,
    };
    const updated = [...messages];
    updated.splice(index + 1, 0, clone);
    setMessages(updated);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleToggleMessageSender = (id: string) => {
    setMessages(
      messages.map((m) => {
        if (
          m.id === id &&
          m.type !== 'date_divider' &&
          m.type !== 'system_notice' &&
          m.type !== 'telegram_join'
        ) {
          return {
            ...m,
            sender: m.sender === 'user' ? 'recipient' : 'user',
            status: m.sender === 'recipient' ? 'read' : 'none',
          };
        }
        return m;
      })
    );
  };

  const currentThemeList = platform === 'telegram' ? TELEGRAM_THEMES : THEMES;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Platform Switcher Header */}
      <div className="p-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              platform === 'whatsapp' ? 'bg-emerald-500' : 'bg-[#2a8ee4]'
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {platform === 'whatsapp' ? 'WhatsApp Mode' : 'Telegram Mode'}
          </span>
        </div>

        <div className="flex bg-slate-900 rounded-xl p-0.5 border border-slate-800">
          <button
            type="button"
            onClick={() => setPlatform('whatsapp')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              platform === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setPlatform('telegram')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              platform === 'telegram'
                ? 'bg-[#2a8ee4] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Telegram
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none">
        {[
          { id: 'messages', label: '💬 Messages', count: messages.length },
          { id: 'profiles', label: '👤 Profiles' },
          { id: 'status', label: '🔋 Status Bar' },
          { id: 'theme', label: '🎨 Theme & BG' },
          { id: 'compare', label: '⚡ Presets' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-slate-800 text-emerald-400 shadow-sm ring-1 ring-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ========================================================================= */}
        {/* TAB 1: MESSAGES LIST (DRAG & DROP) */}
        {/* ========================================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {/* Action Bar for Adding Messages */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenMessageModal(undefined, 'user')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
                  platform === 'telegram'
                    ? 'bg-[#2a8ee4] hover:bg-[#257dc8]'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <span>+ Add Outgoing (You)</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenMessageModal(undefined, 'recipient')}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-98"
              >
                <span>+ Add Incoming (Them)</span>
              </button>
            </div>

            {/* Drag and drop hint */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Drag handle to reorder conversation</span>
              <button
                type="button"
                onClick={() => setMessages([])}
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Sortable Message Items */}
            <div className="space-y-2">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                const isOver = dragOverIndex === idx;

                return (
                  <div
                    key={msg.id || idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`p-3 rounded-xl border transition-all duration-150 flex items-center gap-2.5 ${
                      isOver
                        ? 'border-emerald-500 bg-emerald-950/30 scale-[1.01]'
                        : isUser
                        ? 'bg-purple-950/20 border-purple-900/40 hover:border-purple-800'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Drag Handle */}
                    <div
                      className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-1 select-none"
                      title="Drag to reorder"
                    >
                      ⋮⋮
                    </div>

                    {/* Sender badge indicator */}
                    <button
                      type="button"
                      onClick={() => handleToggleMessageSender(msg.id)}
                      title="Click to flip sender (Left <-> Right)"
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors ${
                        msg.type === 'date_divider' || msg.type === 'telegram_join'
                          ? 'bg-slate-800 text-slate-400'
                          : isUser
                          ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {msg.type === 'date_divider'
                        ? 'Date'
                        : msg.type === 'telegram_join'
                        ? 'Join'
                        : isUser
                        ? 'You ⇄'
                        : 'Them ⇄'}
                    </button>

                    {/* Message Preview Text */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onOpenMessageModal(msg)}
                    >
                      <div className="text-xs text-white truncate font-medium">
                        {msg.type === 'text' && msg.text}
                        {msg.type === 'voice_note' && `🎙️ Voice Note (${msg.duration})`}
                        {msg.type === 'telegram_join' && `🚀 ${msg.text}`}
                        {msg.type === 'channel_invite' && `📣 ${msg.channelName}`}
                        {msg.type === 'image' && `🖼️ Photo (${msg.caption || 'Image'})`}
                        {msg.type === 'document' && `📄 File (${msg.fileName})`}
                        {msg.type === 'date_divider' && `📅 ${msg.text}`}
                        {msg.type === 'system_notice' && `🔒 ${msg.text}`}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        {msg.time && <span>{msg.time}</span>}
                        {isUser && msg.status && <span>· {msg.status}</span>}
                        {msg.bubbleColor && (
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: msg.bubbleColor }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveMessage(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 rounded"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMessage(idx, 'down')}
                        disabled={idx === messages.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 rounded"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateMessage(idx)}
                        className="p-1 text-slate-400 hover:text-emerald-400 rounded text-xs"
                        title="Duplicate"
                      >
                        ⧉
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenMessageModal(msg)}
                        className="p-1 text-slate-400 hover:text-cyan-400 rounded text-xs"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded text-xs"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PROFILES & RECIPIENT SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'profiles' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Recipient Contact ({platform === 'telegram' ? 'Telegram' : 'WhatsApp'})
              </span>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipient.name}
                  onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                  placeholder={platform === 'telegram' ? 'Nancy B' : 'ℬoss Sunny 😈'}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Status Subtitle
                </label>
                <input
                  type="text"
                  value={recipient.statusText}
                  onChange={(e) => setRecipient({ ...recipient, statusText: e.target.value })}
                  placeholder="last seen recently / online / typing..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Name Typography Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'roboto', label: 'Roboto (TG Default)' },
                    { id: 'cursive', label: 'Dancing Script' },
                    { id: 'caveat', label: 'Caveat' },
                    { id: 'kalam', label: 'Kalam' },
                    { id: 'default', label: 'Jakarta Sans' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setRecipient({ ...recipient, nameFont: font.id as any })}
                      className={`p-2 rounded-xl border text-xs text-center transition-colors ${
                        recipient.nameFont === font.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-semibold block">{font.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                    <img
                      src={recipient.avatarUrl || ASSETS.nancyAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={recipient.avatarUrl}
                      onChange={(e) => setRecipient({ ...recipient, avatarUrl: e.target.value })}
                      placeholder="Image URL"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs outline-none"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          setRecipient({ ...recipient, avatarUrl: ASSETS.nancyAvatar })
                        }
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px]"
                      >
                        👩 Nancy B Preset
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRecipient({ ...recipient, avatarUrl: ASSETS.warningAvatarBadge })
                        }
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px]"
                      >
                        ⚠️ Warning Sign Preset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STATUS BAR CONTROLS */}
        {/* ========================================================================= */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Top Status Bar
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusBar.showStatusBar}
                    onChange={(e) =>
                      setStatusBar({ ...statusBar, showStatusBar: e.target.checked })
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-xs text-slate-400">Show Bar</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Status Bar Clock Time
                </label>
                <input
                  type="text"
                  value={statusBar.time}
                  onChange={(e) => setStatusBar({ ...statusBar, time: e.target.value })}
                  placeholder="5:32 PM"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Battery Level</span>
                  <span className="text-white font-bold">{statusBar.batteryLevel}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={statusBar.batteryLevel}
                  onChange={(e) =>
                    setStatusBar({ ...statusBar, batteryLevel: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: THEMES & CHAT WALLPAPER */}
        {/* ========================================================================= */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                {platform === 'telegram' ? 'Telegram Themes' : 'WhatsApp Themes'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(currentThemeList).map((th) => (
                  <button
                    key={th.preset + th.name}
                    type="button"
                    onClick={() => setTheme(th)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      theme.name === th.name
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: th.outgoingBubbleBg }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: th.headerBg }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-white block truncate">
                      {th.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PRESETS & REFERENCE COMPARISON */}
        {/* ========================================================================= */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/40 via-slate-950 to-slate-900 border border-sky-800/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Telegram Reference Matcher (Nancy B)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-semibold">
                  1-Click Match
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instantly load Nancy B Telegram chat with "Nancy B joined Telegram!", AMOLED pure black background, purple & cyan-blue message bubbles, and date capsules!
              </p>
              <button
                type="button"
                onClick={onLoadTelegramReferencePreset}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#2a8ee4] hover:bg-[#237fcb] text-white shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>✈️ Restore Telegram Screenshot State</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-900 border border-purple-800/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  WhatsApp Reference Matcher (Boss Sunny)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                  1-Click Match
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Restore the WhatsApp Business Velvet Purple screenshot with voice notes, waveforms, and channel admin invite card.
              </p>
              <button
                type="button"
                onClick={onLoadReferencePreset}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>⚡ Restore WhatsApp Screenshot State</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
