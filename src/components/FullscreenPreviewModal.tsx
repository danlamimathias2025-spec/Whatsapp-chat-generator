import React from 'react';
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
import { PhonePreview } from './PhonePreview';

interface FullscreenPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  recipient: ContactProfile;
  sender: ContactProfile;
  statusBar: StatusBarConfig;
  theme: ThemeConfig;
  wallpaper: WallpaperConfig;
  deviceFrame: DeviceFrameConfig;
  watermark?: WatermarkConfig;
  platform?: AppPlatform;
  onSendMessage?: (text: string, sender: 'user' | 'recipient') => void;
  referenceImageUrl?: string;
}

export const FullscreenPreviewModal: React.FC<FullscreenPreviewModalProps> = ({
  isOpen,
  onClose,
  messages,
  recipient,
  sender,
  statusBar,
  theme,
  wallpaper,
  deviceFrame,
  watermark,
  platform = 'whatsapp',
  onSendMessage,
  referenceImageUrl,
}) => {
  const [viewMode, setViewMode] = React.useState<'single' | 'compare'>('single');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-fadeIn">
      {/* Top Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-white">Live Screenshot Preview</span>
          {referenceImageUrl && (
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'single' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Interactive Phone
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compare')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'compare' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                Side-by-Side Reference Comparison
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <span>✕ Close Preview</span>
        </button>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
        {viewMode === 'compare' && referenceImageUrl ? (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl w-full">
            {/* Reference image from user */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Original Uploaded Screenshot
              </span>
              <div className="w-[360px] sm:w-[380px] h-[750px] rounded-[32px] overflow-hidden shadow-2xl border border-purple-500/30">
                <img
                  src={referenceImageUrl}
                  alt="Original Reference"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Generated Recreation */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Your Interactive Generated Recreation
              </span>
              <PhonePreview
                messages={messages}
                recipient={recipient}
                sender={sender}
                statusBar={statusBar}
                theme={theme}
                wallpaper={wallpaper}
                deviceFrame={{ ...deviceFrame, showDeviceBezels: false }}
                watermark={watermark}
                platform={platform}
                onSendMessage={onSendMessage}
              />
            </div>
          </div>
        ) : (
          <PhonePreview
            messages={messages}
            recipient={recipient}
            sender={sender}
            statusBar={statusBar}
            theme={theme}
            wallpaper={wallpaper}
            deviceFrame={deviceFrame}
            watermark={watermark}
            platform={platform}
            onSendMessage={onSendMessage}
          />
        )}
      </div>
    </div>
  );
};
