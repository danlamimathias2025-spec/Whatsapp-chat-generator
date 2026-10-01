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
      {/* Left zone: Time & optional carrier */}
      <div className="flex items-center gap-1.5 tracking-tight">
        <span className="font-semibold text-[13px]">{config.time || '5:32 PM'}</span>
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

      {/* Right zone: Bluetooth, Network, WiFi, Battery */}
      <div className="flex items-center gap-2">
        {config.showBluetooth && (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
          </svg>
        )}

        {/* Network Badge (4G / 5G / LTE / VoLTE) */}
        {config.networkType !== 'none' && (
          <span className="text-[10px] font-bold tracking-tight px-1 py-0.2 rounded bg-white/10 opacity-90">
            {config.networkType}
          </span>
        )}

        {/* Cellular Signal Bars */}
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

        {/* WiFi Icon */}
        {config.wifiStrength > 0 && (
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
          <span className="text-[10px] font-semibold tracking-tight">{config.batteryLevel}%</span>
          <div className="relative flex items-center">
            {/* Battery Body */}
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
              {/* Charging lightning bolt inside */}
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
            {/* Battery Terminal Tip */}
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
