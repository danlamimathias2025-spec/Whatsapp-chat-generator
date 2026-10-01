import React, { useState } from 'react';
import {
  ChatMessage,
  ContactProfile,
  DeviceFrameConfig,
  StatusBarConfig,
  ThemeConfig,
  WallpaperConfig,
} from '../types/chat';
import { ASSETS, THEMES, OTHER_PRESETS } from '../constants/presets';

interface ControlPanelProps {
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
  referenceImageUrl?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
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
  referenceImageUrl,
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
        if (m.id === id && m.type !== 'date_divider' && m.type !== 'system_notice') {
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

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
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
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-98"
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
                        msg.type === 'date_divider'
                          ? 'bg-slate-800 text-slate-400'
                          : isUser
                          ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {msg.type === 'date_divider' ? 'Date' : isUser ? 'You ⇄' : 'Them ⇄'}
                    </button>

                    {/* Message Preview Text */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onOpenMessageModal(msg)}
                    >
                      <div className="text-xs text-white truncate font-medium">
                        {msg.type === 'text' && msg.text}
                        {msg.type === 'voice_note' && `🎙️ Voice Note (${msg.duration})`}
                        {msg.type === 'channel_invite' && `📣 ${msg.channelName}`}
                        {msg.type === 'image' && `🖼️ Photo (${msg.caption || 'Image'})`}
                        {msg.type === 'document' && `📄 File (${msg.fileName})`}
                        {msg.type === 'date_divider' && `📅 ${msg.text}`}
                        {msg.type === 'system_notice' && `🔒 ${msg.text}`}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        {msg.time && <span>{msg.time}</span>}
                        {isUser && msg.status && <span>· {msg.status}</span>}
                      </div>
                    </div>

                    {/* Action buttons (Up, Down, Edit, Duplicate, Delete) */}
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
            {/* Recipient Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Recipient Contact (Them)
              </span>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipient.name}
                  onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                  placeholder="ℬoss Sunny 😈"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Font Style for Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Name Typography Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'cursive', label: 'Dancing Script', sample: 'ℬoss Sunny' },
                    { id: 'caveat', label: 'Caveat', sample: 'Boss Sunny' },
                    { id: 'kalam', label: 'Kalam', sample: 'Boss Sunny' },
                    { id: 'roboto', label: 'Roboto', sample: 'Boss Sunny' },
                    { id: 'default', label: 'Jakarta Sans', sample: 'Boss Sunny' },
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

              {/* Recipient Avatar */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                    <img
                      src={recipient.avatarUrl}
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
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setRecipient({ ...recipient, avatarUrl: ASSETS.warningAvatarBadge })
                        }
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px]"
                      >
                        ⚠️ Warning Sign Preset
                      </button>
                      <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] cursor-pointer">
                        Upload File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setRecipient({
                                    ...recipient,
                                    avatarUrl: ev.target.result as string,
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Business Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recipient.isBusiness}
                    onChange={(e) =>
                      setRecipient({ ...recipient, isBusiness: e.target.checked })
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-xs text-slate-300">WhatsApp Business</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recipient.isOnline}
                    onChange={(e) =>
                      setRecipient({ ...recipient, isOnline: e.target.checked })
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-xs text-slate-300">Online Green Dot</span>
                </label>
              </div>
            </div>

            {/* Sender (You) Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                Sender Profile (You)
              </span>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Voice Note Avatar Badge
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                    <img
                      src={sender.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={sender.avatarUrl}
                      onChange={(e) => setSender({ ...sender, avatarUrl: e.target.value })}
                      placeholder="Image URL"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSender({ ...sender, avatarUrl: ASSETS.purpleMicBadge })
                        }
                        className="px-2.5 py-1 bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 rounded-lg text-[11px]"
                      >
                        🎙️ Neon Mic Badge
                      </button>
                      <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] cursor-pointer">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setSender({
                                    ...sender,
                                    avatarUrl: ev.target.result as string,
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
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

              {/* Time */}
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

              {/* Battery Level */}
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
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusBar.isCharging}
                    onChange={(e) =>
                      setStatusBar({ ...statusBar, isCharging: e.target.checked })
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-xs text-slate-300">Charging (Lightning bolt)</span>
                </label>
              </div>

              {/* Network Signal & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Cellular Signal Bars ({statusBar.signalStrength}/4)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={statusBar.signalStrength}
                    onChange={(e) =>
                      setStatusBar({ ...statusBar, signalStrength: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Network Badge
                  </label>
                  <select
                    value={statusBar.networkType}
                    onChange={(e) =>
                      setStatusBar({ ...statusBar, networkType: e.target.value as any })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs outline-none"
                  >
                    <option value="5G">5G</option>
                    <option value="4G">4G</option>
                    <option value="LTE">LTE</option>
                    <option value="VoLTE">VoLTE</option>
                    <option value="none">Hidden</option>
                  </select>
                </div>
              </div>

              {/* WiFi */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Wi-Fi Signal Strength ({statusBar.wifiStrength}/4)
                </label>
                <input
                  type="range"
                  min={0}
                  max={4}
                  value={statusBar.wifiStrength}
                  onChange={(e) =>
                    setStatusBar({ ...statusBar, wifiStrength: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Extra Icons */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={statusBar.showAlarm}
                    onChange={(e) =>
                      setStatusBar({ ...statusBar, showAlarm: e.target.checked })
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span>Alarm</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={statusBar.showLocation}
                    onChange={(e) =>
                      setStatusBar({ ...statusBar, showLocation: e.target.checked })
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span>GPS</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={statusBar.showBluetooth}
                    onChange={(e) =>
                      setStatusBar({ ...statusBar, showBluetooth: e.target.checked })
                    }
                    className="accent-emerald-500 rounded"
                  />
                  <span>Bluetooth</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: THEMES & CHAT WALLPAPER */}
        {/* ========================================================================= */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            {/* Theme Presets */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Color Themes
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(THEMES).map((th) => (
                  <button
                    key={th.preset}
                    type="button"
                    onClick={() => setTheme(th)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      theme.preset === th.preset
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

            {/* Custom Color Overrides */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Custom Bubble & Accent Colors
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Outgoing Bubble</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.outgoingBubbleBg}
                      onChange={(e) =>
                        setTheme({ ...theme, outgoingBubbleBg: e.target.value, preset: 'custom' })
                      }
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-slate-300">{theme.outgoingBubbleBg}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Incoming Bubble</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.incomingBubbleBg}
                      onChange={(e) =>
                        setTheme({ ...theme, incomingBubbleBg: e.target.value, preset: 'custom' })
                      }
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-slate-300">{theme.incomingBubbleBg}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Top Header</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.headerBg}
                      onChange={(e) =>
                        setTheme({ ...theme, headerBg: e.target.value, preset: 'custom' })
                      }
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-slate-300">{theme.headerBg}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Accent (Mic / Send)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) =>
                        setTheme({ ...theme, accentColor: e.target.value, preset: 'custom' })
                      }
                      className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-slate-300">{theme.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallpaper Controls */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Chat Wallpaper
              </span>

              {/* Wallpaper Presets */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setWallpaper({
                      ...wallpaper,
                      imageUrl: ASSETS.wallpaper,
                      opacity: 0.85,
                      darkness: 0.35,
                    })
                  }
                  className="p-2 rounded-xl border border-purple-800/40 bg-purple-950/20 hover:border-purple-600 flex items-center gap-2 text-xs text-left"
                >
                  <img src={ASSETS.wallpaper} alt="" className="w-8 h-12 object-cover rounded" />
                  <div>
                    <span className="font-semibold text-white block">Romantic Roses</span>
                    <span className="text-[10px] text-purple-300">Screenshot match</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setWallpaper({
                      ...wallpaper,
                      imageUrl: '',
                      darkness: 0,
                    })
                  }
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-center text-xs text-slate-300"
                >
                  None (Solid Color)
                </button>
              </div>

              {/* Custom Wallpaper Upload */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-slate-400">
                  Custom Wallpaper URL / Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wallpaper.imageUrl || ''}
                    onChange={(e) => setWallpaper({ ...wallpaper, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs outline-none"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium cursor-pointer transition-colors shrink-0">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setWallpaper({
                                ...wallpaper,
                                imageUrl: ev.target.result as string,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Darkness Dimmer & Blur */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Wallpaper Dimming / Darkness</span>
                    <span className="text-white font-mono">
                      {Math.round(wallpaper.darkness * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={wallpaper.darkness}
                    onChange={(e) =>
                      setWallpaper({ ...wallpaper, darkness: Number(e.target.value) })
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
                    max={15}
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
        {/* TAB 5: PRESETS & REFERENCE COMPARISON */}
        {/* ========================================================================= */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            {/* 1-Click Reference Loader */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-900 border border-purple-800/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Uploaded Reference Matcher
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                  1-Click Match
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instantly load the exact 14 chat messages, voice notes, channel invite card,
                custom velvet purple theme, timestamps, and wallpaper matching your reference screenshot!
              </p>
              <button
                type="button"
                onClick={onLoadReferencePreset}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>⚡ Restore Reference Screenshot State</span>
              </button>
            </div>

            {/* Additional Conversation Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Other Conversation Templates
              </span>
              {OTHER_PRESETS.map((pst) => (
                <div
                  key={pst.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {pst.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {pst.description}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRecipient(pst.recipient);
                      setMessages(pst.messages as any);
                      if (THEMES[pst.theme]) {
                        setTheme(THEMES[pst.theme]);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 shrink-0 transition-colors"
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>

            {/* Device Frame Toggle */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Device Mockup Frame
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'galaxy', label: 'Samsung S25' },
                  { id: 'iphone', label: 'iPhone 16 Pro' },
                  { id: 'frameless', label: 'Clean Frameless' },
                ].map((df) => (
                  <button
                    key={df.id}
                    type="button"
                    onClick={() =>
                      setDeviceFrame({
                        ...deviceFrame,
                        type: df.id as any,
                        showDeviceBezels: df.id !== 'frameless',
                      })
                    }
                    className={`py-2 px-2 rounded-xl border text-xs font-medium transition-colors ${
                      deviceFrame.type === df.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {df.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
