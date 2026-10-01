import React, { useState } from 'react';
import { ExportOptions } from '../utils/exportImage';

interface TopNavProps {
  onExport: (options: ExportOptions) => void;
  onCopyClipboard: () => void;
  isExporting: boolean;
  zoom: number;
  setZoom: (zoom: number) => void;
  onToggleFullscreenPreview: () => void;
  onLoadReferencePreset: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onExport,
  onCopyClipboard,
  isExporting,
  zoom,
  setZoom,
  onToggleFullscreenPreview,
  onLoadReferencePreset,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-16 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30 sticky top-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-sm shadow-sm">
            💬
          </span>
          <span>WhatsCraft</span>
        </a>
        <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-medium text-slate-400 border border-slate-700/60">
          Studio Studio Pro
        </span>
      </div>

      {/* Zone 2: Navigation & Viewport / Zoom Controls */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={onLoadReferencePreset}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-950/40 transition-colors flex items-center gap-1.5"
        >
          <span>⚡ Reference Match</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-800" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 text-xs text-slate-400 px-1">
          <button
            type="button"
            onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
            className="p-1 hover:text-white hover:bg-slate-900 rounded"
            title="Zoom Out"
          >
            -
          </button>
          <span className="font-mono text-[11px] text-slate-200 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(Math.min(1.4, zoom + 0.1))}
            className="p-1 hover:text-white hover:bg-slate-900 rounded"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-white rounded"
          >
            Reset
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-800" />

        {/* Fullscreen Preview */}
        <button
          type="button"
          onClick={onToggleFullscreenPreview}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          <span>Preview Mode</span>
        </button>
      </div>

      {/* Zone 3: Primary Action & Export Controls */}
      <div className="flex items-center gap-2.5">
        {/* Dark Mode Quick Toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle Theme Mode"
        >
          {isDarkMode ? (
            <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Copy to Clipboard */}
        <button
          type="button"
          onClick={onCopyClipboard}
          disabled={isExporting}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copy Image</span>
        </button>

        {/* Export Dropdown / Primary CTA */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isExporting ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            <span>Export Screenshot</span>
            <span className="text-[10px] opacity-75">▼</span>
          </button>

          {/* Export Quality Options Menu */}
          {showExportMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn"
              onClick={() => setShowExportMenu(false)}
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Export Resolution
              </div>
              <button
                type="button"
                onClick={() => onExport({ format: 'png', scale: 2, fileName: 'whatsapp-chat-2x.png' })}
                className="w-full px-3 py-2 text-left rounded-xl text-xs text-white hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <span>High Res PNG (2x Retina)</span>
                <span className="text-[10px] text-emerald-400 font-mono">Recommended</span>
              </button>
              <button
                type="button"
                onClick={() => onExport({ format: 'png', scale: 3, fileName: 'whatsapp-chat-4k.png' })}
                className="w-full px-3 py-2 text-left rounded-xl text-xs text-white hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <span>Ultra 4K PNG (3x Crisp)</span>
                <span className="text-[10px] text-purple-400 font-mono">Ultra HD</span>
              </button>
              <button
                type="button"
                onClick={() => onExport({ format: 'jpeg', scale: 2, quality: 0.95, fileName: 'whatsapp-chat.jpg' })}
                className="w-full px-3 py-2 text-left rounded-xl text-xs text-white hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <span>Standard JPEG (2x)</span>
                <span className="text-[10px] text-slate-400 font-mono">Compact</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
