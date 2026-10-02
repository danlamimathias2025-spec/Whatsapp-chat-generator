import { ContactProfile, StatusBarConfig, ThemeConfig, WallpaperConfig, WatermarkConfig, ChatMessage } from '../types/chat';

// Generated assets
export const ASSETS = {
  wallpaper: '/src/assets/images/romantic_roses_wallpaper_1790873686052.jpg',
  purpleMicBadge: '/src/assets/images/purple_neon_mic_badge_1790873697275.jpg',
  warningAvatarBadge: '/src/assets/images/warning_avatar_badge_1790873707562.jpg',
  nancyAvatar: '/src/assets/images/nancy_telegram_avatar_1790875969702.jpg',
};

export interface WallpaperPreset {
  id: string;
  name: string;
  type: 'image' | 'gradient' | 'solid';
  value: string; // image URL or CSS gradient/color string
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'roses',
    name: 'Romantic Roses',
    type: 'image',
    value: ASSETS.wallpaper,
  },
  {
    id: 'midnight_blue',
    name: 'Midnight Blue Gradient',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
  },
  {
    id: 'emerald_glow',
    name: 'Emerald Cyberpunk',
    type: 'gradient',
    value: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022f2e 100%)',
  },
  {
    id: 'velvet_plum',
    name: 'Velvet Plum Velvet',
    type: 'gradient',
    value: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #4c1d95 100%)',
  },
  {
    id: 'sunset_glow',
    name: 'Sunset Twilight',
    type: 'gradient',
    value: 'linear-gradient(135deg, #431407 0%, #7c2d12 50%, #881337 100%)',
  },
  {
    id: 'amoled_black',
    name: 'Pure AMOLED Black',
    type: 'solid',
    value: '#000000',
  },
];

export const DEFAULT_TELEGRAM_RECIPIENT: ContactProfile = {
  name: '',
  nameFont: 'roboto',
  avatarUrl: '',
  statusText: 'last seen recently',
  isOnline: false,
  isBusiness: false,
  isVerified: false,
};

export const DEFAULT_TELEGRAM_SENDER: ContactProfile = {
  name: '',
  nameFont: 'default',
  avatarUrl: '',
  statusText: 'online',
  isOnline: true,
  isBusiness: false,
  isVerified: false,
};

export const TELEGRAM_THEMES: Record<string, ThemeConfig> = {
  telegram_dark: {
    preset: 'amoled_black',
    name: 'Telegram AMOLED Dark (Screenshot Match)',
    isDarkMode: true,
    headerBg: '#000000',
    chatBg: '#000000',
    incomingBubbleBg: '#212121',
    incomingTextColor: '#ffffff',
    incomingTimeColor: '#8a8a8a',
    outgoingBubbleBg: '#8a47bb',
    outgoingTextColor: '#ffffff',
    outgoingTimeColor: '#d6b7ee',
    inputBarBg: '#181818',
    inputTextColor: '#ffffff',
    accentColor: '#2b84d4',
    fontFamily: 'cursive',
  },
  telegram_blue: {
    preset: 'custom',
    name: 'Telegram Classic Dark Blue',
    isDarkMode: true,
    headerBg: '#17212b',
    chatBg: '#0e1621',
    incomingBubbleBg: '#182533',
    incomingTextColor: '#f5f5f5',
    incomingTimeColor: '#6c7883',
    outgoingBubbleBg: '#2b5278',
    outgoingTextColor: '#f5f5f5',
    outgoingTimeColor: '#8da8c7',
    inputBarBg: '#17212b',
    inputTextColor: '#ffffff',
    accentColor: '#5288c1',
    fontFamily: 'roboto',
  },
  telegram_day: {
    preset: 'custom',
    name: 'Telegram Day Light',
    isDarkMode: false,
    headerBg: '#517da2',
    chatBg: '#e4ecf2',
    incomingBubbleBg: '#ffffff',
    incomingTextColor: '#000000',
    incomingTimeColor: '#a0acb6',
    outgoingBubbleBg: '#effdde',
    outgoingTextColor: '#000000',
    outgoingTimeColor: '#6da059',
    inputBarBg: '#ffffff',
    inputTextColor: '#000000',
    accentColor: '#3390ec',
    fontFamily: 'roboto',
  },
};

export const TELEGRAM_REFERENCE_MESSAGES: ChatMessage[] = [];

export const DEFAULT_RECIPIENT: ContactProfile = {
  name: '',
  nameFont: 'cursive',
  avatarUrl: '',
  statusText: '',
  isOnline: false,
  isBusiness: true,
  isVerified: false,
  showCustomBadge: false,
};

export const DEFAULT_SENDER: ContactProfile = {
  name: '',
  nameFont: 'default',
  avatarUrl: '',
  statusText: '',
  isOnline: true,
  isBusiness: false,
  isVerified: false,
};

export const DEFAULT_STATUS_BAR: StatusBarConfig = {
  showStatusBar: true,
  time: '5:32 PM',
  batteryLevel: 68,
  showBatteryPercent: true,
  isCharging: false,
  wifiEnabled: true,
  wifiStrength: 4,
  mobileDataEnabled: true,
  signalStrength: 4,
  networkType: '4G',
  showNotificationIcon: true,
  notificationType: 'message',
  showAlarm: false,
  showLocation: false,
  showBluetooth: false,
  style: 'android',
  darkModeIcons: false, // white icons on dark background
};

export const DEFAULT_WATERMARK: WatermarkConfig = {
  enabled: false,
  text: 'Generated with AI Studio Studio',
  position: 'bottom-right',
  opacity: 0.5,
  fontSize: 12,
};

export const THEMES: Record<string, ThemeConfig> = {
  reference_purple: {
    preset: 'reference_purple',
    name: 'Reference Velvet Purple (Screenshot)',
    isDarkMode: true,
    headerBg: '#0f0c15',
    chatBg: '#0b0910',
    incomingBubbleBg: '#23272a',
    incomingTextColor: '#e2e8f0',
    incomingTimeColor: '#94a3b8',
    outgoingBubbleBg: '#67207c',
    outgoingTextColor: '#ffffff',
    outgoingTimeColor: '#d8b4e2',
    inputBarBg: '#181520',
    inputTextColor: '#f8fafc',
    accentColor: '#9d32b5',
    fontFamily: 'cursive',
  },
  whatsapp_dark: {
    preset: 'whatsapp_dark',
    name: 'Official WhatsApp Dark Mode',
    isDarkMode: true,
    headerBg: '#1f2c34',
    chatBg: '#0b141a',
    incomingBubbleBg: '#202c33',
    incomingTextColor: '#e9edef',
    incomingTimeColor: '#8696a0',
    outgoingBubbleBg: '#005c4b',
    outgoingTextColor: '#e9edef',
    outgoingTimeColor: '#8696a0',
    inputBarBg: '#1f2c34',
    inputTextColor: '#e9edef',
    accentColor: '#00a884',
    fontFamily: 'roboto',
  },
  whatsapp_light: {
    preset: 'whatsapp_light',
    name: 'Official WhatsApp Light Mode',
    isDarkMode: false,
    headerBg: '#008069',
    chatBg: '#efeae2',
    incomingBubbleBg: '#ffffff',
    incomingTextColor: '#111b21',
    incomingTimeColor: '#667781',
    outgoingBubbleBg: '#d9fdd3',
    outgoingTextColor: '#111b21',
    outgoingTimeColor: '#667781',
    inputBarBg: '#ffffff',
    inputTextColor: '#111b21',
    accentColor: '#00a884',
    fontFamily: 'roboto',
  },
  amoled_black: {
    preset: 'amoled_black',
    name: 'AMOLED Midnight Black',
    isDarkMode: true,
    headerBg: '#000000',
    chatBg: '#000000',
    incomingBubbleBg: '#18181b',
    incomingTextColor: '#fafafa',
    incomingTimeColor: '#71717a',
    outgoingBubbleBg: '#27272a',
    outgoingTextColor: '#fafafa',
    outgoingTimeColor: '#a1a1aa',
    inputBarBg: '#09090b',
    inputTextColor: '#fafafa',
    accentColor: '#10b981',
    fontFamily: 'default',
  },
  whatsapp_business: {
    preset: 'whatsapp_business',
    name: 'WhatsApp Business Teal',
    isDarkMode: true,
    headerBg: '#0e2429',
    chatBg: '#0a171a',
    incomingBubbleBg: '#182b30',
    incomingTextColor: '#e8f3f5',
    incomingTimeColor: '#7da0a8',
    outgoingBubbleBg: '#0f5257',
    outgoingTextColor: '#ffffff',
    outgoingTimeColor: '#97d2d6',
    inputBarBg: '#14272c',
    inputTextColor: '#e8f3f5',
    accentColor: '#00a884',
    fontFamily: 'roboto',
  },
};

export const DEFAULT_WALLPAPER: WallpaperConfig = {
  type: 'solid',
  imageUrl: '',
  opacity: 0.6,
  blur: 0,
  darkness: 0,
  zoom: 1,
};

// Exact messages from the uploaded reference screenshot
export const REFERENCE_MESSAGES: ChatMessage[] = [];

export const OTHER_PRESETS = [
  {
    id: 'crypto_deal',
    title: 'Crypto Deal VIP',
    description: 'High-stake trade confirmation and wallet update',
    theme: 'amoled_black',
    recipient: {
      name: 'Satoshi Alpha 🚀',
      nameFont: 'default' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=150&auto=format&fit=crop&q=80',
      statusText: 'Online',
      isOnline: true,
      isBusiness: false,
      isVerified: true,
    },
    messages: [
      {
        id: 'p1-1',
        sender: 'recipient' as const,
        type: 'text' as const,
        text: 'Did the 5.2 ETH transaction settle on L2 yet?',
        time: '11:42 AM',
        status: 'none' as const,
      },
      {
        id: 'p1-2',
        sender: 'user' as const,
        type: 'text' as const,
        text: 'Confirmed with 32 block confirmations ⚡',
        time: '11:43 AM',
        status: 'read' as const,
      },
      {
        id: 'p1-3',
        sender: 'user' as const,
        type: 'voice_note' as const,
        duration: '0:24',
        time: '11:44 AM',
        status: 'read' as const,
        waveformProgress: 40,
      },
      {
        id: 'p1-4',
        sender: 'recipient' as const,
        type: 'text' as const,
        text: 'Perfect! Signing the multisig now.',
        time: '11:45 AM',
        status: 'none' as const,
      },
    ],
  },
  {
    id: 'business_client',
    title: 'Creative Agency Client',
    description: 'Project approval and feedback discussion',
    theme: 'whatsapp_business',
    recipient: {
      name: 'Elena Rostova (Design Dir.)',
      nameFont: 'roboto' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      statusText: 'WhatsApp Business Account',
      isOnline: false,
      isBusiness: true,
      isVerified: true,
    },
    messages: [
      {
        id: 'b1-1',
        sender: 'recipient' as const,
        type: 'text' as const,
        text: 'Hi team, reviewed the latest Figma prototypes. The typography hierarchy looks impeccable!',
        time: '2:15 PM',
        status: 'none' as const,
      },
      {
        id: 'b1-2',
        sender: 'user' as const,
        type: 'text' as const,
        text: 'Thank you Elena! We adjusted the contrast ratios and touch padding per your feedback.',
        time: '2:18 PM',
        status: 'read' as const,
      },
      {
        id: 'b1-3',
        sender: 'recipient' as const,
        type: 'text' as const,
        text: 'Approved for final release! 🚀 Let us push to staging.',
        time: '2:20 PM',
        status: 'none' as const,
      },
    ],
  },
];
