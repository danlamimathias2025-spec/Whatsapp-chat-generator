import React, { useState, useRef } from 'react';
import {
  ChatMessage,
  ContactProfile,
  DeviceFrameConfig,
  StatusBarConfig,
  ThemeConfig,
  WallpaperConfig,
} from './types/chat';
import {
  DEFAULT_RECIPIENT,
  DEFAULT_SENDER,
  DEFAULT_STATUS_BAR,
  DEFAULT_WALLPAPER,
  REFERENCE_MESSAGES,
  THEMES,
} from './constants/presets';
import { TopNav } from './components/TopNav';
import { ControlPanel } from './components/ControlPanel';
import { PhonePreview } from './components/PhonePreview';
import { MessageEditorModal } from './components/MessageEditorModal';
import { FullscreenPreviewModal } from './components/FullscreenPreviewModal';
import { exportElementAsImage, copyElementToClipboard, ExportOptions } from './utils/exportImage';

export default function App() {
  // Main chat state initialized with uploaded screenshot reference
  const [messages, setMessages] = useState<ChatMessage[]>(REFERENCE_MESSAGES);
  const [recipient, setRecipient] = useState<ContactProfile>(DEFAULT_RECIPIENT);
  const [sender, setSender] = useState<ContactProfile>(DEFAULT_SENDER);
  const [statusBar, setStatusBar] = useState<StatusBarConfig>(DEFAULT_STATUS_BAR);
  const [theme, setTheme] = useState<ThemeConfig>(THEMES.reference_purple);
  const [wallpaper, setWallpaper] = useState<WallpaperConfig>(DEFAULT_WALLPAPER);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameConfig>({
    type: 'galaxy',
    showDeviceBezels: true,
    showNavigationBar: false,
  });

  // UI & Viewport States
  const [zoom, setZoom] = useState<number>(0.95);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [modalDefaultSender, setModalDefaultSender] = useState<'user' | 'recipient'>('user');
  const [isFullscreenPreviewOpen, setIsFullscreenPreviewOpen] = useState<boolean>(false);

  // Reference uploaded image path
  const referenceImageSrc = '/Screenshot_20261001-174600_WhatsAppBusiness.jpg';

  const phoneCanvasRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Restore exact reference screenshot state
  const handleLoadReferencePreset = () => {
    setMessages(REFERENCE_MESSAGES);
    setRecipient(DEFAULT_RECIPIENT);
    setSender(DEFAULT_SENDER);
    setStatusBar(DEFAULT_STATUS_BAR);
    setTheme(THEMES.reference_purple);
    setWallpaper(DEFAULT_WALLPAPER);
    showToast('✨ Restored Reference Screenshot Preset!');
  };

  // Open modal for editing or adding
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
      setMessages([...messages, savedMsg]);
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

  // Direct typing in phone input bar
  const handleQuickSendMessage = (text: string, senderType: 'user' | 'recipient' = 'user') => {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const mins = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderType,
      type: 'text',
      text,
      time: `${hours}:${mins} ${ampm}`,
      status: senderType === 'user' ? 'read' : 'none',
    };

    setMessages([...messages, newMsg]);
  };

  // Export Screenshot Handler
  const handleExportScreenshot = async (options: ExportOptions) => {
    if (!phoneCanvasRef.current) return;
    try {
      setIsExporting(true);
      await exportElementAsImage(phoneCanvasRef.current, options);
      showToast(`🎉 Screenshot exported in ${options.scale}x resolution!`);
    } catch (err) {
      console.error(err);
      showToast('⚠️ Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to clipboard
  const handleCopyClipboard = async () => {
    if (!phoneCanvasRef.current) return;
    try {
      setIsExporting(true);
      const success = await copyElementToClipboard(phoneCanvasRef.current, 2);
      if (success) {
        showToast('📋 Screenshot copied to clipboard!');
      } else {
        showToast('⚠️ Could not copy image directly to clipboard.');
      }
    } catch (err) {
      console.error(err);
      showToast('⚠️ Clipboard copy failed.');
    } finally {
      setIsExporting(false);
    }
  };

  // Dark mode toggle between Reference Dark and Light mode
  const handleToggleDarkMode = () => {
    if (theme.isDarkMode) {
      setTheme(THEMES.whatsapp_light);
    } else {
      setTheme(THEMES.reference_purple);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
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
        {/* Left Side: Drag-and-Drop & Customization Control Panel */}
        <section className="w-full lg:w-[460px] xl:w-[500px] h-[480px] lg:h-[calc(100vh-64px)] p-3 lg:p-4 border-r border-slate-800 shrink-0">
          <ControlPanel
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
            onOpenMessageModal={handleOpenMessageModal}
            onLoadReferencePreset={handleLoadReferencePreset}
            referenceImageUrl={referenceImageSrc}
          />
        </section>

        {/* Right Side: Interactive Live Phone Canvas Workspace */}
        <section className="flex-1 h-[calc(100vh-64px)] overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-950 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
          {/* Quick Toolbar above Phone */}
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

            {/* Quick Add Buttons on canvas */}
            <button
              type="button"
              onClick={() => handleOpenMessageModal(undefined, 'user')}
              className="px-3 py-1 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>+ Outgoing</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenMessageModal(undefined, 'recipient')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
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

          {/* Render Interactive Phone Preview */}
          <PhonePreview
            ref={phoneCanvasRef}
            messages={messages}
            recipient={recipient}
            sender={sender}
            statusBar={statusBar}
            theme={theme}
            wallpaper={wallpaper}
            deviceFrame={deviceFrame}
            zoom={zoom}
            onEditMessage={handleOpenMessageModal}
            onDeleteMessage={handleDeleteMessage}
            onToggleSender={handleToggleSender}
            onSendMessage={handleQuickSendMessage}
            onHeaderAvatarClick={() => {
              showToast('Edit Recipient Avatar in Profiles Tab');
            }}
            onHeaderNameClick={() => {
              showToast('Edit Recipient Name in Profiles Tab');
            }}
          />
        </section>
      </main>

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
        onSendMessage={handleQuickSendMessage}
        referenceImageUrl={referenceImageSrc}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl border border-slate-700 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-slideUp">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
