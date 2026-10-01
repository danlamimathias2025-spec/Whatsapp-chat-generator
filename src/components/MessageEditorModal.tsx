import React, { useState, useEffect } from 'react';
import { ChatMessage, MessageType, ReadReceiptStatus } from '../types/chat';
import { ASSETS } from '../constants/presets';

interface MessageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: ChatMessage) => void;
  editingMessage?: ChatMessage | null;
  defaultSender?: 'user' | 'recipient';
  platform?: 'whatsapp' | 'telegram';
}

export const MessageEditorModal: React.FC<MessageEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMessage,
  defaultSender = 'user',
  platform = 'whatsapp',
}) => {
  const [type, setType] = useState<MessageType>('text');
  const [sender, setSender] = useState<'user' | 'recipient'>(defaultSender);
  const [time, setTime] = useState('7:36 PM');
  const [status, setStatus] = useState<ReadReceiptStatus>('read');
  const [isStarred, setIsStarred] = useState(false);
  const [bubbleColor, setBubbleColor] = useState<string>('');

  // Text specific
  const [text, setText] = useState('');

  // Voice note specific
  const [duration, setDuration] = useState('0:12');
  const [waveformProgress, setWaveformProgress] = useState(25);
  const [avatarBadgeType, setAvatarBadgeType] = useState<'purple_mic' | 'warning_icon' | 'profile' | 'none'>('purple_mic');
  const [avatarBadgeUrl, setAvatarBadgeUrl] = useState(ASSETS.purpleMicBadge);

  // Channel invite specific
  const [channelName, setChannelName] = useState('LEGIT 🤑 UPDATES ✅✅✅');
  const [subtitle, setSubtitle] = useState('Channel admin invite');
  const [statusBadge, setStatusBadge] = useState('Invite accepted');
  const [description, setDescription] = useState(
    "Accept this invitation to be an admin for my WhatsApp channel, 'LEGIT 🤑 UPDATES ✅✅✅'"
  );

  // Image specific
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  // Document specific
  const [fileName, setFileName] = useState('Contract_Proposal.pdf');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [fileType, setFileType] = useState('PDF');

  // Date divider
  const [dividerText, setDividerText] = useState('Today');

  useEffect(() => {
    if (editingMessage) {
      setType(editingMessage.type);
      setSender(editingMessage.sender);
      setTime(editingMessage.time || '7:36 PM');
      setStatus(editingMessage.status || 'read');
      setIsStarred(!!editingMessage.isStarred);
      setBubbleColor(editingMessage.bubbleColor || '');

      if (editingMessage.type === 'text') {
        setText(editingMessage.text || '');
      } else if (editingMessage.type === 'voice_note') {
        setDuration(editingMessage.duration || '0:12');
        setWaveformProgress(editingMessage.waveformProgress || 25);
        setAvatarBadgeType(editingMessage.avatarBadgeType || 'purple_mic');
        setAvatarBadgeUrl(editingMessage.avatarBadgeUrl || ASSETS.purpleMicBadge);
      } else if (editingMessage.type === 'channel_invite') {
        setChannelName(editingMessage.channelName || '');
        setSubtitle(editingMessage.subtitle || '');
        setStatusBadge(editingMessage.statusBadge || '');
        setDescription(editingMessage.description || '');
      } else if (editingMessage.type === 'image') {
        setImageUrl(editingMessage.imageUrl || '');
        setCaption(editingMessage.caption || '');
      } else if (editingMessage.type === 'document') {
        setFileName(editingMessage.fileName || '');
        setFileSize(editingMessage.fileSize || '');
        setFileType(editingMessage.fileType || 'PDF');
      } else if (editingMessage.type === 'date_divider' || editingMessage.type === 'system_notice' || editingMessage.type === 'telegram_join') {
        setDividerText(editingMessage.text || 'Today');
      }
    } else {
      // Defaults for new message
      setSender(defaultSender);
      setText('');
      setType('text');
      setBubbleColor('');
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const mins = now.getMinutes().toString().padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      setTime(`${hours}:${mins} ${ampm}`);
    }
  }, [editingMessage, defaultSender, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingMessage?.id || `msg-${Date.now()}`;

    let builtMessage: ChatMessage;

    if (type === 'text') {
      builtMessage = {
        id,
        sender,
        type: 'text',
        text: text || 'Hey there!',
        time,
        status,
        isStarred,
        bubbleColor: bubbleColor || undefined,
      };
    } else if (type === 'voice_note') {
      builtMessage = {
        id,
        sender,
        type: 'voice_note',
        duration: duration || '0:12',
        waveformProgress,
        avatarBadgeType,
        avatarBadgeUrl:
          avatarBadgeType === 'purple_mic'
            ? ASSETS.purpleMicBadge
            : avatarBadgeType === 'warning_icon'
            ? ASSETS.warningAvatarBadge
            : avatarBadgeUrl,
        time,
        status,
        isStarred,
        bubbleColor: bubbleColor || undefined,
      };
    } else if (type === 'telegram_join') {
      builtMessage = {
        id,
        sender: 'recipient',
        type: 'telegram_join',
        text: dividerText || 'Nancy B joined Telegram!',
        time: '',
      };
    } else if (type === 'channel_invite') {
      builtMessage = {
        id,
        sender,
        type: 'channel_invite',
        channelName,
        subtitle,
        statusBadge,
        description,
        time,
        status,
        isStarred,
      };
    } else if (type === 'image') {
      builtMessage = {
        id,
        sender,
        type: 'image',
        imageUrl: imageUrl || ASSETS.wallpaper,
        caption,
        time,
        status,
        isStarred,
      };
    } else if (type === 'document') {
      builtMessage = {
        id,
        sender,
        type: 'document',
        fileName,
        fileSize,
        fileType,
        time,
        status,
        isStarred,
      };
    } else if (type === 'date_divider') {
      builtMessage = {
        id,
        sender: 'recipient',
        type: 'date_divider',
        text: dividerText || 'Today',
        time: '',
      };
    } else {
      builtMessage = {
        id,
        sender: 'recipient',
        type: 'system_notice',
        text: dividerText || 'Messages and calls are end-to-end encrypted.',
        time: '',
      };
    }

    onSave(builtMessage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {editingMessage ? 'Edit Message' : 'Add Message'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {/* Message Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Message Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {[
                { id: 'text', label: '💬 Text' },
                { id: 'voice_note', label: '🎙️ Voice Note' },
                { id: 'telegram_join', label: '🚀 Joined TG' },
                { id: 'channel_invite', label: '📣 Channel Card' },
                { id: 'image', label: '🖼️ Photo' },
                { id: 'document', label: '📄 File' },
                { id: 'date_divider', label: '📅 Date Pill' },
                { id: 'system_notice', label: '🔒 Notice' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as MessageType)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    type === item.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sender & Alignment */}
          {type !== 'date_divider' && type !== 'system_notice' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Sender (Side)
                </label>
                <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSender('recipient')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      sender === 'recipient'
                        ? 'bg-slate-800 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Recipient (Left)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSender('user')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      sender === 'user'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    You (Right)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Timestamp
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="7:36 PM"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Read Receipt (for outgoing) */}
          {sender === 'user' && type !== 'date_divider' && type !== 'system_notice' && type !== 'telegram_join' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Read Receipts Status
              </label>
              <div className="grid grid-cols-5 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'read', label: '✓✓ Blue', desc: 'Read' },
                  { id: 'delivered', label: '✓✓ Gray', desc: 'Delivered' },
                  { id: 'sent', label: '✓ Sent', desc: 'Sent' },
                  { id: 'pending', label: '🕒 Clock', desc: 'Pending' },
                  { id: 'none', label: 'None', desc: 'Hidden' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatus(st.id as ReadReceiptStatus)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-colors ${
                      status === st.id
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bubble Color Override (Useful for Telegram Purple vs Cyan) */}
          {sender === 'user' && (type === 'text' || type === 'voice_note') && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Bubble Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: 'Theme Default', color: '' },
                  { label: 'Telegram Purple', color: '#8a47bb' },
                  { label: 'Telegram Cyan Blue', color: '#2b84d4' },
                  { label: 'WhatsApp Green', color: '#005c4b' },
                  { label: 'Velvet Plum', color: '#67207c' },
                ].map((col) => (
                  <button
                    key={col.label}
                    type="button"
                    onClick={() => setBubbleColor(col.color)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                      bubbleColor === col.color
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {col.color ? (
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }} />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-slate-600 bg-transparent" />
                    )}
                    <span>{col.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type Specific Form Fields */}

          {/* 1. TEXT */}
          {type === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Message Content
              </label>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type the message text here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-emerald-500 outline-none resize-none"
                autoFocus
              />
            </div>
          )}

          {/* 2. VOICE NOTE */}
          {type === 'voice_note' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Audio Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="0:12"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Playback Progress ({waveformProgress}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={waveformProgress}
                    onChange={(e) => setWaveformProgress(Number(e.target.value))}
                    className="w-full accent-emerald-500 mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Voice Note Avatar Badge (Reference Style)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarBadgeType('purple_mic');
                      setAvatarBadgeUrl(ASSETS.purpleMicBadge);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-colors ${
                      avatarBadgeType === 'purple_mic'
                        ? 'border-purple-500 bg-purple-950/40 text-purple-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <img src={ASSETS.purpleMicBadge} alt="" className="w-5 h-5 rounded-full" />
                    <span>Neon Purple Mic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAvatarBadgeType('warning_icon');
                      setAvatarBadgeUrl(ASSETS.warningAvatarBadge);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-colors ${
                      avatarBadgeType === 'warning_icon'
                        ? 'border-yellow-500 bg-yellow-950/40 text-yellow-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <img src={ASSETS.warningAvatarBadge} alt="" className="w-5 h-5 rounded-full" />
                    <span>Warning Sign</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatarBadgeType('profile')}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-colors ${
                      avatarBadgeType === 'profile'
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <span>Default Avatar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. CHANNEL INVITE */}
          {type === 'channel_invite' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="LEGIT 🤑 UPDATES ✅✅✅"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Channel admin invite"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Status Badge
                  </label>
                  <input
                    type="text"
                    value={statusBadge}
                    onChange={(e) => setStatusBadge(e.target.value)}
                    placeholder="Invite accepted"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Accept this invitation to be an admin..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:border-emerald-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* 4. PHOTO */}
          {type === 'image' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Image URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
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
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setImageUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Look at this..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* 5. DOCUMENT */}
          {type === 'document' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Project_Proposal.pdf"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="1.8 MB"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Extension
                  </label>
                  <input
                    type="text"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    placeholder="PDF"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. DATE DIVIDER OR NOTICE */}
          {(type === 'date_divider' || type === 'system_notice') && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {type === 'date_divider' ? 'Date Divider Label' : 'Notice Text'}
              </label>
              <input
                type="text"
                value={dividerText}
                onChange={(e) => setDividerText(e.target.value)}
                placeholder="Today"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 outline-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all active:scale-95"
            >
              {editingMessage ? 'Save Changes' : 'Add to Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
