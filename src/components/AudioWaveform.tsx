import React from 'react';

interface AudioWaveformProps {
  progress?: number; // 0 - 100
  barCount?: number;
  activeColor?: string;
  inactiveColor?: string;
  isPlayed?: boolean;
  className?: string;
  onSeek?: (percentage: number) => void;
}

// Preset realistic voice heights for authentic variation
const SAMPLE_BARS = [
  6, 12, 18, 22, 14, 8, 16, 24, 28, 20, 10, 15, 25, 22, 18, 12,
  8, 14, 26, 30, 24, 16, 10, 6, 12, 20, 26, 18, 14, 8, 12, 16,
  22, 26, 18, 10, 6, 14, 20, 16, 10, 6
];

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  progress = 25,
  barCount = 36,
  activeColor = '#ffffff',
  inactiveColor = 'rgba(255, 255, 255, 0.4)',
  className = '',
  onSeek,
}) => {
  const bars = React.useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      return SAMPLE_BARS[i % SAMPLE_BARS.length];
    });
  }, [barCount]);

  const activeIndex = Math.floor((progress / 100) * barCount);

  return (
    <div 
      className={`relative flex items-center gap-[2px] h-8 cursor-pointer select-none py-1 group ${className}`}
      onClick={(e) => {
        if (!onSeek) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.min(Math.max((clickX / rect.width) * 100, 0), 100);
        onSeek(pct);
      }}
    >
      {bars.map((height, index) => {
        const isActive = index <= activeIndex;
        return (
          <span
            key={index}
            className="w-[2.5px] rounded-full transition-colors duration-150"
            style={{
              height: `${Math.max(4, height)}px`,
              backgroundColor: isActive ? activeColor : inactiveColor,
            }}
          />
        );
      })}

      {/* Scrubber handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full shadow-md pointer-events-none transition-transform duration-100 ease-out"
        style={{
          left: `calc(${progress}% - 6px)`,
          backgroundColor: activeColor,
          boxShadow: '0 0 6px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
};
