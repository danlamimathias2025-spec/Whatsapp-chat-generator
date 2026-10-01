import React from 'react';
import { AppPlatform } from '../types/chat';

interface BottomNavBarProps {
  platform: AppPlatform;
  setPlatform: (platform: AppPlatform) => void;
  whatsappMessageCount?: number;
  telegramMessageCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  platform,
  setPlatform,
  whatsappMessageCount = 0,
  telegramMessageCount = 0,
}) => {
  return (
    <nav
      aria-label="Platform Switcher"
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-full border border-slate-700 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center gap-1.5 max-w-sm sm:max-w-md w-[92%] sm:w-auto"
    >
      {/* WhatsApp Tab */}
      <button
        type="button"
        onClick={() => setPlatform('whatsapp')}
        className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
          platform === 'whatsapp'
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
          💬
        </span>
        <span className="truncate">WhatsApp</span>
        {whatsappMessageCount > 0 && (
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              platform === 'whatsapp' ? 'bg-black/30 text-emerald-100' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {whatsappMessageCount}
          </span>
        )}
      </button>

      {/* Telegram Tab */}
      <button
        type="button"
        onClick={() => setPlatform('telegram')}
        className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
          platform === 'telegram'
            ? 'bg-[#2a8ee4] text-white shadow-lg shadow-[#2a8ee4]/30 scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
      >
        {/* Telegram Paper Plane Icon */}
        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
        </span>
        <span className="truncate">Telegram</span>
        {telegramMessageCount > 0 && (
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              platform === 'telegram' ? 'bg-black/30 text-sky-100' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {telegramMessageCount}
          </span>
        )}
      </button>
    </nav>
  );
};
