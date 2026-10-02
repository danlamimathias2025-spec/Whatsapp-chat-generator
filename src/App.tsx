import React, { useState, useRef } from 'react';
import {
  AppPlatform,
  ChatMessage,
  ContactProfile,
  DeviceFrameConfig,
  StatusBarConfig,
  ThemeConfig,
  WallpaperConfig,
  WatermarkConfig,
} from './types/chat';
import {
  DEFAULT_RECIPIENT,
  DEFAULT_SENDER,
  DEFAULT_STATUS_BAR,
  DEFAULT_WALLPAPER,
  DEFAULT_WATERMARK,
  REFERENCE_MESSAGES,
  THEMES,
  DEFAULT_TELEGRAM_RECIPIENT,
  DEFAULT_TELEGRAM_SENDER,
  TELEGRAM_THEMES,
  TELEGRAM_REFERENCE_MESSAGES,
} from './constants/presets';
import { TopNav } from './components/TopNav';
import { ControlPanel } from './components/ControlPanel';
import { PhonePreview } from './components/PhonePreview';
import { MessageEditorModal } from './components/MessageEditorModal';
import { FullscreenPreviewModal } from './components/FullscreenPreviewModal';
import { BottomNavBar } from './components/BottomNavBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { exportElementAsImage, copyElementToClipboard, ExportOptions } from './utils/exportImage';

export default function App() {
  const [platform, setPlatform] = useState<AppPlatform>('telegram'); // Default to Telegram to match latest user screenshot request

  // WhatsApp states
  const [waMessages, setWaMessages] = useState<ChatMessage[]>(REFERENCE_MESSAGES);
  const [waRecipient, setWaRecipient] = useState<ContactProfile>(DEFAULT_RECIPIENT);
  const [waSender, setWaSender] = useState<ContactProfile>(DEFAULT_SENDER);
  const [waTheme, setWaTheme] = useState<ThemeConfig>(THEMES.reference_purple);
  const [waWallpaper, setWaWallpaper] = useState<WallpaperConfig>(DEFAULT_WALLPAPER);

  // Telegram states
  const [tgMessages, setTgMessages] = useState<ChatMessage[]>(TELEGRAM_REFERENCE_MESSAGES);
  const [tgRecipient, setTgRecipient] = useState<ContactProfile>(DEFAULT_TELEGRAM_RECIPIENT);
  const [tgSender, setTgSender] = useState<ContactProfile>(DEFAULT_TELEGRAM_SENDER);
  const [tgTheme, setTgTheme] = useState<ThemeConfig>(TELEGRAM_THEMES.telegram_dark);
  const [tgWallpaper, setTgWallpaper] = useState<WallpaperConfig>({
    type: 'solid',
    opacity: 1,
    blur: 0,
    darkness: 0,
    zoom: 1,
  });

  // Shared status bar & device frame
  const [statusBar, setStatusBar] = useState<StatusBarConfig>(DEFAULT_STATUS_BAR);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameConfig>({
    type: 'galaxy',
    showDeviceBezels: true,
    showNavigationBar: false,
  });
  const [watermark, setWatermark] = useState<WatermarkConfig>(DEFAULT_WATERMARK);
  const [smartChronologyEnabled, setSmartChronologyEnabled] = useState<boolean>(true);
  const [smartChronologyMinutes, setSmartChronologyMinutes] = useState<number>(2);
  const [globalReadReceiptsEnabled, setGlobalReadReceiptsEnabled] = useState<boolean>(true);

  // Helper for Smart Chronology timestamp calculation
  const calculateNextTimestamp = (currentMessages: ChatMessage[], incrementMinutes: number): string => {
    const lastMsgWithTime = [...currentMessages].reverse().find((m) => m.time && m.time.trim() !== '');
    let baseDate = new Date();

    if (lastMsgWithTime && lastMsgWithTime.time) {
      const parts = lastMsgWithTime.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (parts) {
        let hours = parseInt(parts[1], 10);
        const minutes = parseInt(parts[2], 10);
        const ampm = parts[3] ? parts[3].toUpperCase() : '';

        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        baseDate.setHours(hours, minutes, 0, 0);
      }
    }

    baseDate.setTime(baseDate.getTime() + incrementMinutes * 60 * 1000);

    const h = baseDate.getHours() % 12 || 12;
    const m = baseDate.getMinutes().toString().padStart(2, '0');
    const ap = baseDate.getHours() >= 12 ? 'PM' : 'AM';
    return `${h}:${m} ${ap}`;
  };

  // Active current platform bindings
  const messages = platform === 'telegram' ? tgMessages : waMessages;
  const setMessages = platform === 'telegram' ? setTgMessages : setWaMessages;
  const recipient = platform === 'telegram' ? tgRecipient : waRecipient;
  const setRecipient = platform === 'telegram' ? setTgRecipient : setWaRecipient;
  const sender = platform === 'telegram' ? tgSender : waSender;
  const setSender = platform === 'telegram' ? setTgSender : setWaSender;
  const theme = platform === 'telegram' ? tgTheme : waTheme;
  const setTheme = platform === 'telegram' ? setTgTheme : setWaTheme;
  const wallpaper = platform === 'telegram' ? tgWallpaper : waWallpaper;
  const setWallpaper = platform === 'telegram' ? setTgWallpaper : setWaWallpaper;

  // UI & Viewport States
  const [zoom, setZoom] = useState<number>(0.95);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [modalDefaultSender, setModalDefaultSender] = useState<'user' | 'recipient'>('user');
  const [isFullscreenPreviewOpen, setIsFullscreenPreviewOpen] = useState<boolean>(false);

  const referenceImageSrc = '/Screenshot_20261001-174600_WhatsAppBusiness.jpg';
  const telegramReferenceImageSrc = '/Screenshot_20261001-183044_Telegram.jpg';

  const phoneCanvasRef = useRef<HTMLDivElement>(null);
  const headerAvatarInputRef = useRef<HTMLInputElement>(null);

  const handleHeaderAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file too large (max 10MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setRecipient((prev) => ({ ...prev, avatarUrl: dataUrl }));
        showToast('Profile picture updated!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Restore WhatsApp Reference Preset
  const handleLoadReferencePreset = () => {
    setPlatform('whatsapp');
    setWaMessages(REFERENCE_MESSAGES);
    setWaRecipient(DEFAULT_RECIPIENT);
    setWaSender(DEFAULT_SENDER);
    setWaTheme(THEMES.reference_purple);
    setWaWallpaper(DEFAULT_WALLPAPER);
    showToast('✨ Restored WhatsApp Velvet Purple Preset!');
  };

  // Restore Telegram Reference Preset
  const handleLoadTelegramReferencePreset = () => {
    setPlatform('telegram');
    setTgMessages(TELEGRAM_REFERENCE_MESSAGES);
    setTgRecipient(DEFAULT_TELEGRAM_RECIPIENT);
    setTgSender(DEFAULT_TELEGRAM_SENDER);
    setTgTheme(TELEGRAM_THEMES.telegram_dark);
    showToast('✈️ Restored Telegram Nancy B Preset!');
  };

  const handleOpenMessageModal = (
    message?: ChatMessage,
    defaultSender: 'user' | 'recipient' = 'user'
  ) => {
    setEditingMessage(message || null);
    setModalDefaultSender(defaultSender);
    setIsMessageModalOpen(true);
  };

  const handleSaveMessage = (savedMsg: ChatMessage) => {
    if (editingMessage) {
      setMessages(messages.map((m) => (m.id === savedMsg.id ? savedMsg : m)));
      showToast('Message updated');
    } else {
      let finalMsg = savedMsg;
      if (smartChronologyEnabled && (!finalMsg.time || finalMsg.time.trim() === '')) {
        finalMsg = {
          ...finalMsg,
          time: calculateNextTimestamp(messages, smartChronologyMinutes),
        };
      }
      setMessages([...messages, finalMsg]);
      showToast('Message added');
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    showToast('Message deleted');
  };

  const handleToggleSender = (id: string) => {
    setMessages(
      messages.map((m) => {
        if (m.id === id) {
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
  };

  const handleReorderMessages = (dragIndex: number, hoverIndex: number) => {
    const updated = [...messages];
    const [movedItem] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, movedItem);
    setMessages(updated);
  };

  const handleQuickSendMessage = (text: string, senderType: 'user' | 'recipient' = 'user') => {
    const timeStr = smartChronologyEnabled
      ? calculateNextTimestamp(messages, smartChronologyMinutes)
      : (() => {
          const now = new Date();
          const hours = now.getHours() % 12 || 12;
          const mins = now.getMinutes().toString().padStart(2, '0');
          const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
          return `${hours}:${mins} ${ampm}`;
        })();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderType,
      type: 'text',
      text,
      time: timeStr,
      status: senderType === 'user' ? 'read' : 'none',
      bubbleColor: platform === 'telegram' && senderType === 'user' ? '#8a47bb' : undefined,
    };

    setMessages([...messages, newMsg]);
  };

  const handleQuickSendImage = (imageUrl: string, senderType: 'user' | 'recipient' = 'user') => {
    const timeStr = smartChronologyEnabled
      ? calculateNextTimestamp(messages, smartChronologyMinutes)
      : (() => {
          const now = new Date();
          const hours = now.getHours() % 12 || 12;
          const mins = now.getMinutes().toString().padStart(2, '0');
          const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
          return `${hours}:${mins} ${ampm}`;
        })();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderType,
      type: 'image',
      imageUrl,
      caption: '',
      time: timeStr,
      status: senderType === 'user' ? 'read' : 'none',
    };

    setMessages([...messages, newMsg]);
  };

  const handleQuickSendVoiceNote = (duration: string, senderType: 'user' | 'recipient' = 'user') => {
    const timeStr = smartChronologyEnabled
      ? calculateNextTimestamp(messages, smartChronologyMinutes)
      : (() => {
          const now = new Date();
          const hours = now.getHours() % 12 || 12;
          const mins = now.getMinutes().toString().padStart(2, '0');
          const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
          return `${hours}:${mins} ${ampm}`;
        })();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderType,
      type: 'voice_note',
      duration,
      waveformProgress: 20,
      avatarBadgeType: 'profile',
      time: timeStr,
      status: senderType === 'user' ? 'read' : 'none',
    };

    setMessages([...messages, newMsg]);
  };

  const handleExportScreenshot = async (options: ExportOptions) => {
    if (!phoneCanvasRef.current) return;
    try {
      setIsExporting(true);
      await exportElementAsImage(phoneCanvasRef.current, options);
      showToast(`🎉 ${platform === 'telegram' ? 'Telegram' : 'WhatsApp'} screenshot exported successfully!`);
    } catch (err) {
      console.error(err);
      showToast('⚠️ Failed to export image.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    if (!phoneCanvasRef.current) return;
    try {
      setIsExporting(true);
      const success = await copyElementToClipboard(phoneCanvasRef.current, 2);
      if (success) {
        showToast('📋 Screenshot copied to clipboard!');
      } else {
        showToast('⚠️ Could not copy image.');
      }
    } catch (err) {
      console.error(err);
      showToast('⚠️ Clipboard copy failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleToggleDarkMode = () => {
    if (platform === 'whatsapp') {
      setWaTheme(waTheme.isDarkMode ? THEMES.whatsapp_light : THEMES.reference_purple);
    } else {
      setTgTheme(tgTheme.name.includes('Day') ? TELEGRAM_THEMES.telegram_dark : TELEGRAM_THEMES.telegram_day);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 sm:pb-0">
      {/* Top Navigation Bar */}
      <TopNav
        onExport={handleExportScreenshot}
        onCopyClipboard={handleCopyClipboard}
        isExporting={isExporting}
        zoom={zoom}
        setZoom={setZoom}
        onToggleFullscreenPreview={() => setIsFullscreenPreviewOpen(true)}
        onLoadReferencePreset={handleLoadReferencePreset}
        isDarkMode={theme.isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Control Panel */}
        <section className="w-full lg:w-[460px] xl:w-[500px] h-[480px] lg:h-[calc(100vh-64px)] p-3 lg:p-4 border-r border-slate-800 shrink-0">
          <ControlPanel
            platform={platform}
            setPlatform={setPlatform}
            messages={messages}
            setMessages={setMessages}
            recipient={recipient}
            setRecipient={setRecipient}
            sender={sender}
            setSender={setSender}
            statusBar={statusBar}
            setStatusBar={setStatusBar}
            theme={theme}
            setTheme={setTheme}
            wallpaper={wallpaper}
            setWallpaper={setWallpaper}
            deviceFrame={deviceFrame}
            setDeviceFrame={setDeviceFrame}
            watermark={watermark}
            setWatermark={setWatermark}
            smartChronologyEnabled={smartChronologyEnabled}
            setSmartChronologyEnabled={setSmartChronologyEnabled}
            smartChronologyMinutes={smartChronologyMinutes}
            setSmartChronologyMinutes={setSmartChronologyMinutes}
            globalReadReceiptsEnabled={globalReadReceiptsEnabled}
            setGlobalReadReceiptsEnabled={setGlobalReadReceiptsEnabled}
            onOpenMessageModal={handleOpenMessageModal}
            onLoadReferencePreset={handleLoadReferencePreset}
            onLoadTelegramReferencePreset={handleLoadTelegramReferencePreset}
            referenceImageUrl={referenceImageSrc}
            telegramReferenceImageUrl={telegramReferenceImageSrc}
          />
        </section>

        {/* Right Side: Interactive Live Phone Canvas */}
        <section className="flex-1 h-[calc(100vh-64px)] overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-950 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-800 shadow-md">
            <span className="text-xs text-slate-400 font-medium">Device Frame:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl">
              {[
                { id: 'galaxy', label: 'Galaxy' },
                { id: 'iphone', label: 'iPhone' },
                { id: 'frameless', label: 'Frameless' },
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    deviceFrame.type === df.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>

            <div className="w-[1px] h-4 bg-slate-800 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={() => handleOpenMessageModal(undefined, 'user')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold text-white shadow-sm transition-colors ${
                platform === 'telegram' ? 'bg-[#2a8ee4] hover:bg-[#237fcb]' : 'bg-purple-700 hover:bg-purple-600'
              }`}
            >
              <span>+ Outgoing</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenMessageModal(undefined, 'recipient')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <span>+ Incoming</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreenPreviewOpen(true)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              🔍 Fullscreen
            </button>
          </div>

          {/* Hidden File Input for Direct Phone Header Avatar Upload */}
          <input
            type="file"
            ref={headerAvatarInputRef}
            accept="image/*"
            onChange={handleHeaderAvatarUpload}
            className="hidden"
          />

          <PhonePreview
            ref={phoneCanvasRef}
            messages={messages}
            recipient={recipient}
            sender={sender}
            statusBar={statusBar}
            theme={theme}
            wallpaper={wallpaper}
            deviceFrame={deviceFrame}
            watermark={watermark}
            platform={platform}
            zoom={zoom}
            onEditMessage={handleOpenMessageModal}
            onDeleteMessage={handleDeleteMessage}
            onToggleSender={handleToggleSender}
            onSendMessage={handleQuickSendMessage}
            onSendImage={handleQuickSendImage}
            onSendVoiceNote={handleQuickSendVoiceNote}
            onHeaderAvatarClick={() => headerAvatarInputRef.current?.click()}
            onReorderMessages={handleReorderMessages}
            globalReadReceiptsEnabled={globalReadReceiptsEnabled}
          />
        </section>
      </main>

      {/* Bottom Navigation Bar to separate WhatsApp and Telegram */}
      <BottomNavBar
        platform={platform}
        setPlatform={setPlatform}
        whatsappMessageCount={waMessages.length}
        telegramMessageCount={tgMessages.length}
      />

      {/* Message Creator / Editor Modal */}
      <MessageEditorModal
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setEditingMessage(null);
        }}
        onSave={handleSaveMessage}
        editingMessage={editingMessage}
        defaultSender={modalDefaultSender}
        platform={platform}
      />

      {/* Fullscreen & Comparison Preview Modal */}
      <FullscreenPreviewModal
        isOpen={isFullscreenPreviewOpen}
        onClose={() => setIsFullscreenPreviewOpen(false)}
        messages={messages}
        recipient={recipient}
        sender={sender}
        statusBar={statusBar}
        theme={theme}
        wallpaper={wallpaper}
        deviceFrame={deviceFrame}
        watermark={watermark}
        platform={platform}
        onSendMessage={handleQuickSendMessage}
        referenceImageUrl={platform === 'telegram' ? telegramReferenceImageSrc : referenceImageSrc}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl border border-slate-700 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-slideUp">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Mode Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
