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
