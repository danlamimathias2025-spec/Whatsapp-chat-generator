import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppLogo } from './AppLogo';

interface PWAInstallButtonProps {
  variant?: 'topnav' | 'bottomnav' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'topnav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Hide if already installed in standalone mode
  if (isInstalled) {
    return null;
  }

  // Android / Desktop / Chrome flow
  if (isInstallable) {
    if (variant === 'bottomnav') {
      return (
        <button
          type="button"
          onClick={install}
          className="flex flex-col items-center justify-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors py-1 px-3"
          title="Install WhatsCraft PWA"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <span className="text-[10px] font-bold tracking-tight">Install</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
        title="Install WhatsCraft App on Home Screen"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {variant === 'bottomnav' ? (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="flex flex-col items-center justify-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors py-1 px-3"
            title="Install WhatsCraft on iPhone / iPad"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v12m0 0l-3-3m3 3l3-3M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
              </svg>
            </div>
            <span className="text-[10px] font-bold tracking-tight">Install</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v12m0 0l-3-3m3 3l3-3M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
            </svg>
            <span>Install App</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <AppLogo size={32} className="shadow-md rounded-xl" />
                  <h3 className="text-sm font-bold text-white">Install WhatsCraft on iOS</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white text-lg leading-none p-1"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                  <p>Tap the <strong>Share</strong> button (box with upward arrow) in the Safari bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                  <p>Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0">3</span>
                  <p>Tap <strong>Add</strong> in the top right corner to enjoy WhatsCraft natively on your iPhone or iPad!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg transition-all"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
