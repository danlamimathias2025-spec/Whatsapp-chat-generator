import React, { useState } from 'react';
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
import {
  ASSETS,
  THEMES,
  TELEGRAM_THEMES,
  OTHER_PRESETS,
  WALLPAPER_PRESETS,
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
  watermark: WatermarkConfig;
  setWatermark: React.Dispatch<React.SetStateAction<WatermarkConfig>>;
  smartChronologyEnabled: boolean;
  setSmartChronologyEnabled: (enabled: boolean) => void;
  smartChronologyMinutes: number;
  setSmartChronologyMinutes: (minutes: number) => void;
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
  watermark,
  setWatermark,
  smartChronologyEnabled,
  setSmartChronologyEnabled,
  smartChronologyMinutes,
  setSmartChronologyMinutes,
  onOpenMessageModal,
  onLoadReferencePreset,
  onLoadTelegramReferencePreset,
}) => {
  const [activeTab, setActiveTab] = useState<
    'messages' | 'profiles' | 'status' | 'theme' | 'compare' | 'watermark'
  >('messages');

  // Bulk selection state
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  const handleToggleSelectAll = () => {
    if (selectedMessageIds.length === messages.length) {
      setSelectedMessageIds([]);
    } else {
      setSelectedMessageIds(messages.map((m) => m.id));
    }
  };

  const handleToggleSelectMessage = (id: string) => {
    if (selectedMessageIds.includes(id)) {
      setSelectedMessageIds(selectedMessageIds.filter((i) => i !== id));
    } else {
      setSelectedMessageIds([...selectedMessageIds, id]);
    }
  };

  const handleBulkDelete = () => {
    setMessages(messages.filter((m) => !selectedMessageIds.includes(m.id)));
    setSelectedMessageIds([]);
  };

  const handleBulkToggleSender = () => {
    setMessages(
      messages.map((m) => {
        if (
          selectedMessageIds.includes(m.id) &&
          m.type !== 'date_divider' &&
          m.type !== 'system_notice' &&
          m.type !== 'telegram_join'
        ) {
          const nextSender = m.sender === 'user' ? 'recipient' : 'user';
          return {
            ...m,
            sender: nextSender,
            status: nextSender === 'user' ? 'read' : 'none',
          };
        }
        return m;
      })
    );
    setSelectedMessageIds([]);
  };

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
          { id: 'watermark', label: '🛡️ Watermark' },
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
        {/* TAB 1: MESSAGES LIST (DRAG & DROP + BULK ACTIONS) */}
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

            {/* Smart Chronology Setting Card */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">⚡ Smart Chronology</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Auto Time</span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={smartChronologyEnabled}
                    onChange={(e) => setSmartChronologyEnabled(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>{smartChronologyEnabled ? 'ON' : 'OFF'}</span>
                </label>
              </div>
              {smartChronologyEnabled && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1.5 border-t border-slate-900">
                  <span>Increment Interval:</span>
                  <select
                    value={smartChronologyMinutes}
                    onChange={(e) => setSmartChronologyMinutes(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs outline-none font-mono"
                  >
                    <option value={1}>+1 min</option>
                    <option value={2}>+2 mins</option>
                    <option value={3}>+3 mins</option>
                    <option value={5}>+5 mins</option>
                    <option value={10}>+10 mins</option>
                    <option value={15}>+15 mins</option>
                  </select>
                </div>
              )}
            </div>

            {/* Bulk Selection & Action Toolbar */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={messages.length > 0 && selectedMessageIds.length === messages.length}
                    onChange={handleToggleSelectAll}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Select All ({selectedMessageIds.length}/{messages.length})</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setSelectedMessageIds([]);
                  }}
                  className="text-rose-400 hover:text-rose-300 transition-colors font-medium"
                >
                  Clear Chat
                </button>
              </div>

              {selectedMessageIds.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800 animate-fadeIn">
                  <span className="text-[11px] text-emerald-400 font-bold">
                    {selectedMessageIds.length} selected:
                  </span>
                  <button
                    type="button"
                    onClick={handleBulkToggleSender}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    ⇄ Toggle Sender
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>

            {/* Sortable Message Items with Checkboxes */}
            <div className="space-y-2">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                const isOver = dragOverIndex === idx;
                const isSelected = selectedMessageIds.includes(msg.id);

                return (
                  <div
                    key={msg.id || idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`p-3 rounded-xl border transition-all duration-150 flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-950/20'
                        : isOver
                        ? 'border-emerald-500 bg-emerald-950/30 scale-[1.01]'
                        : isUser
                        ? 'bg-purple-950/20 border-purple-900/40 hover:border-purple-800'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Bulk Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectMessage(msg.id)}
                      className="accent-emerald-500 rounded shrink-0"
                    />

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

              {/* Battery Level & Percent Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Battery Level</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={statusBar.showBatteryPercent}
                      onChange={(e) =>
                        setStatusBar({ ...statusBar, showBatteryPercent: e.target.checked })
                      }
                      className="accent-emerald-500 rounded"
                    />
                    <span>Show %</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={statusBar.batteryLevel}
                    onChange={(e) =>
                      setStatusBar({ ...statusBar, batteryLevel: Number(e.target.value) })
                    }
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="text-xs font-mono text-white font-bold w-10 text-right">
                    {statusBar.batteryLevel}%
                  </span>
                </div>
              </div>

              {/* WiFi Toggle & Strength */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Wi-Fi Status</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={statusBar.wifiEnabled}
                      onChange={(e) =>
                        setStatusBar({ ...statusBar, wifiEnabled: e.target.checked })
                      }
                      className="accent-emerald-500 rounded"
                    />
                    <span>{statusBar.wifiEnabled ? 'ON' : 'OFF'}</span>
                  </label>
                </div>
                {statusBar.wifiEnabled && (
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Wi-Fi Strength</span>
                      <span>{statusBar.wifiStrength}/4</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      value={statusBar.wifiStrength}
                      onChange={(e) =>
                        setStatusBar({ ...statusBar, wifiStrength: Number(e.target.value) })
                      }
                      className="w-full accent-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Mobile Data Toggle & Strength */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Mobile Data / Signal</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={statusBar.mobileDataEnabled}
                      onChange={(e) =>
                        setStatusBar({ ...statusBar, mobileDataEnabled: e.target.checked })
                      }
                      className="accent-emerald-500 rounded"
                    />
                    <span>{statusBar.mobileDataEnabled ? 'ON' : 'OFF'}</span>
                  </label>
                </div>
                {statusBar.mobileDataEnabled && (
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Signal Bars</span>
                        <span>{statusBar.signalStrength}/5</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={statusBar.signalStrength}
                        onChange={(e) =>
                          setStatusBar({ ...statusBar, signalStrength: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Network Type</label>
                      <select
                        value={statusBar.networkType}
                        onChange={(e) =>
                          setStatusBar({ ...statusBar, networkType: e.target.value as any })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs outline-none"
                      >
                        <option value="5G">5G</option>
                        <option value="4G">4G</option>
                        <option value="LTE">LTE</option>
                        <option value="3G">3G</option>
                        <option value="VoLTE">VoLTE</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Icon Toggle & Type */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Notification Icon</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={statusBar.showNotificationIcon}
                      onChange={(e) =>
                        setStatusBar({ ...statusBar, showNotificationIcon: e.target.checked })
                      }
                      className="accent-emerald-500 rounded"
                    />
                    <span>{statusBar.showNotificationIcon ? 'Shown' : 'Hidden'}</span>
                  </label>
                </div>
                {statusBar.showNotificationIcon && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Icon Type</label>
                    <select
                      value={statusBar.notificationType}
                      onChange={(e) =>
                        setStatusBar({ ...statusBar, notificationType: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs outline-none"
                    >
                      <option value="message">💬 Message Bubble</option>
                      <option value="mail">✉️ Mail Envelope</option>
                      <option value="call">📞 Phone Call</option>
                      <option value="dot">🟢 Notification Dot</option>
                    </select>
                  </div>
                )}
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

            {/* Professional Chat Backgrounds & Color Gradients Library */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Professional Backgrounds & Gradients
              </span>
              <div className="grid grid-cols-2 gap-2">
                {WALLPAPER_PRESETS.map((wp) => (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() =>
                      setWallpaper({
                        ...wallpaper,
                        imageUrl: wp.value,
                      })
                    }
                    className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      wallpaper.imageUrl === wp.value
                        ? 'border-emerald-500 bg-emerald-950/30'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-8 h-10 rounded-lg shrink-0 border border-white/10 overflow-hidden"
                      style={{
                        background: wp.value.includes('gradient')
                          ? wp.value
                          : `url(${wp.value}) center/cover`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-white block truncate">
                        {wp.name}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">{wp.type}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Wallpaper URL Input */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-medium text-slate-400">
                  Custom Wallpaper URL / Image
                </label>
                <input
                  type="text"
                  value={wallpaper.imageUrl?.includes('gradient') ? '' : wallpaper.imageUrl || ''}
                  onChange={(e) => setWallpaper({ ...wallpaper, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
              </div>

              {/* Wallpaper Opacity & Blur Sliders */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Background Opacity</span>
                    <span className="text-white font-mono">
                      {Math.round(wallpaper.opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={wallpaper.opacity}
                    onChange={(e) =>
                      setWallpaper({ ...wallpaper, opacity: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Background Blur</span>
                    <span className="text-white font-mono">{wallpaper.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={wallpaper.blur}
                    onChange={(e) => setWallpaper({ ...wallpaper, blur: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: WATERMARK SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'watermark' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Export Watermark Overlay
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watermark.enabled}
                    onChange={(e) =>
                      setWatermark({ ...watermark, enabled: e.target.checked })
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-xs text-slate-300 font-semibold">Enable Watermark</span>
                </label>
              </div>

              {watermark.enabled && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Watermark Text / Brand
                    </label>
                    <input
                      type="text"
                      value={watermark.text}
                      onChange={(e) => setWatermark({ ...watermark, text: e.target.value })}
                      placeholder="e.g. @YourBrand / Confidential"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Position</label>
                    <select
                      value={watermark.position}
                      onChange={(e) =>
                        setWatermark({ ...watermark, position: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs outline-none"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="center">Center</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Opacity</span>
                      <span className="text-white font-mono">
                        {Math.round(watermark.opacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={watermark.opacity}
                      onChange={(e) =>
                        setWatermark({ ...watermark, opacity: Number(e.target.value) })
                      }
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Font Size</span>
                      <span className="text-white font-mono">{watermark.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={32}
                      step={1}
                      value={watermark.fontSize}
                      onChange={(e) =>
                        setWatermark({ ...watermark, fontSize: Number(e.target.value) })
                      }
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              )}
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
