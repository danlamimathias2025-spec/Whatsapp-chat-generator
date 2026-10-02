import React from 'react';
import { StatusBarConfig } from '../types/chat';

interface StatusBarProps {
  config: StatusBarConfig;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ config, className = '' }) => {
  if (!config.showStatusBar) return null;

  const iconColor = config.darkModeIcons ? '#111827' : '#ffffff';
  const mutedColor = config.darkModeIcons ? 'rgba(17, 24, 39, 0.4)' : 'rgba(255, 255, 255, 0.4)';

  return (
    <div
      className={`w-full px-5 py-1.5 flex items-center justify-between text-xs font-medium select-none z-20 ${className}`}
      style={{ color: iconColor }}
    >
      {/* Left zone: Time, Notification Icon & optional carrier */}
      <div className="flex items-center gap-2 tracking-tight">
        <span className="font-semibold text-[13px]">{config.time || '5:32 PM'}</span>

        {/* Notification Icon */}
        {config.showNotificationIcon && (
          <div className="flex items-center ml-1">
            {config.notificationType === 'message' && (
              <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            )}
            {config.notificationType === 'mail' && (
              <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            )}
            {config.notificationType === 'call' && (
              <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            )}
            {config.notificationType === 'dot' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
            {config.notificationType === 'whatsapp' && (
              <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.844.5 3.568 1.372 5.056L2.016 22l5.068-1.328c1.436.78 3.084 1.228 4.832 1.228h.008c5.52 0 10-4.48 10-10C21.924 6.48 17.484 2 12.004 2zm0 1.544c4.664 0 8.46 3.796 8.46 8.46 0 4.664-3.796 8.46-8.46 8.46h-.008c-1.636 0-3.192-.472-4.52-1.364l-.324-.192-2.996.784.8-2.924-.212-.336a8.423 8.423 0 0 1-1.288-4.42c0-4.664 3.796-8.46 8.46-8.46h.008z" />
              </svg>
            )}
            {config.notificationType === 'telegram' && (
              <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.1.02-3.41 2.21-3.6 2.33-.2.13-.37.15-.53.15-.32 0-.96-.1-1.43-.26-.57-.19-.74-.29-.7-.5.02-.1.29-.44.82-.9a57.8 57.8 0 0 1 6.55-2.8c.62-.23.75-.2.85-.2.22 0 .44.07.51.27.05.15.06.33.04.47z" />
              </svg>
            )}
            {config.notificationType === 'facebook' && (
              <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            )}
            {config.notificationType === 'instagram' && (
              <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            )}
            {config.notificationType === 'discord' && (
              <svg className="w-3.5 h-3.5 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
              </svg>
            )}
          </div>
        )}

        {config.showAlarm && (
          <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2M5 3L2 6M22 6l-3-3" />
          </svg>
        )}
        {config.showLocation && (
          <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        )}
      </div>

      {/* Right zone: Bluetooth, Mobile Data, WiFi, Battery */}
      <div className="flex items-center gap-2">
        {config.showBluetooth && (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
          </svg>
        )}

        {/* Mobile Data / Cellular Signal */}
        {config.mobileDataEnabled && (
          <div className="flex items-center gap-1">
            {config.networkType !== 'none' && (
              <span className="text-[10px] font-bold tracking-tight px-1 py-0.2 rounded bg-white/10 opacity-90">
                {config.networkType}
              </span>
            )}
            {config.signalStrength > 0 && (
              <div className="flex items-end gap-[1.5px] h-3">
                {[1, 2, 3, 4, 5].slice(0, 4).map((bar) => (
                  <span
                    key={bar}
                    className="w-[2.5px] rounded-[0.5px]"
                    style={{
                      height: `${bar * 2.5 + 2}px`,
                      backgroundColor: bar <= config.signalStrength ? iconColor : mutedColor,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* WiFi Icon */}
        {config.wifiEnabled && config.wifiStrength > 0 && (
          <div className="relative flex items-center justify-center w-3.5 h-3.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" strokeOpacity={config.wifiStrength >= 2 ? '1' : '0.3'} />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" strokeOpacity={config.wifiStrength >= 3 ? '1' : '0.3'} />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeOpacity={config.wifiStrength >= 1 ? '1' : '0.3'} />
              <circle cx="12" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </div>
        )}

        {/* Battery Container */}
        <div className="flex items-center gap-1">
          {config.showBatteryPercent && (
            <span className="text-[10px] font-semibold tracking-tight">{config.batteryLevel}%</span>
          )}
          <div className="relative flex items-center">
            <div
              className="w-5 h-2.5 rounded-[3px] border p-[1px] flex items-center relative overflow-hidden"
              style={{ borderColor: iconColor }}
            >
              <div
                className="h-full rounded-[1px] transition-all duration-300"
                style={{
                  width: `${Math.min(Math.max(config.batteryLevel, 4), 100)}%`,
                  backgroundColor:
                    config.batteryLevel <= 20
                      ? '#ef4444'
                      : config.isCharging
                      ? '#22c55e'
                      : iconColor,
                }}
              />
              {config.isCharging && (
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 text-amber-300 drop-shadow"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              )}
            </div>
            <div
              className="w-[1.5px] h-1 rounded-r-[1px] ml-[0.5px]"
              style={{ backgroundColor: iconColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
