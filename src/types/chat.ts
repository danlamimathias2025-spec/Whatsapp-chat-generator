export type AppPlatform = 'whatsapp' | 'telegram';

export type ReadReceiptStatus = 'sent' | 'delivered' | 'read' | 'pending' | 'starred' | 'none';

export type MessageType = 
  | 'text' 
  | 'voice_note' 
  | 'channel_invite' 
  | 'image' 
  | 'document' 
  | 'date_divider' 
  | 'system_notice'
  | 'telegram_join';

export interface BaseMessage {
  id: string;
  sender: 'recipient' | 'user'; // 'recipient' = left side, 'user' = right side (outgoing)
  time: string;
  type: MessageType;
  status?: ReadReceiptStatus;
  isStarred?: boolean;
  bubbleColor?: string; // Optional per-message bubble color (e.g. Purple vs Blue in Telegram screenshot)
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  text: string;
  replyTo?: {
    senderName: string;
    text: string;
    senderColor?: string;
  };
}

export interface VoiceNoteMessage extends BaseMessage {
  type: 'voice_note';
  duration: string; // e.g. "0:12"
  waveformProgress?: number; // 0 to 100 percentage played
  isPlaying?: boolean;
  avatarBadgeUrl?: string; // Custom badge on voice note (e.g. purple mic badge or warning icon)
  avatarBadgeType?: 'purple_mic' | 'warning_icon' | 'profile' | 'none';
  speed?: '1x' | '1.5x' | '2x';
}

export interface ChannelInviteMessage extends BaseMessage {
  type: 'channel_invite';
  channelIconUrl?: string;
  channelName: string;
  subtitle: string;
  statusBadge: string;
  description: string;
}

export interface ImageMessage extends BaseMessage {
  type: 'image';
  imageUrl: string;
  caption?: string;
  isViewOnce?: boolean;
}

export interface DocumentMessage extends BaseMessage {
  type: 'document';
  fileName: string;
  fileSize: string;
  fileType: string;
  pageCount?: string;
}

export interface DateDividerMessage extends BaseMessage {
  type: 'date_divider';
  text: string; // "Today", "Yesterday", "October 1, 2026"
}

export interface SystemNoticeMessage extends BaseMessage {
  type: 'system_notice';
  text: string;
}

export interface TelegramJoinMessage extends BaseMessage {
  type: 'telegram_join';
  text: string;
}

export type ChatMessage = 
  | TextMessage 
  | VoiceNoteMessage 
  | ChannelInviteMessage 
  | ImageMessage 
  | DocumentMessage 
  | DateDividerMessage 
  | SystemNoticeMessage
  | TelegramJoinMessage;

export interface ContactProfile {
  name: string;
  nameFont: 'default' | 'cursive' | 'script' | 'kalam' | 'roboto' | 'caveat';
  avatarUrl: string;
  statusText: string; // "Online", "typing...", "last seen today at...", or empty
  isOnline: boolean;
  isBusiness: boolean;
  isVerified: boolean;
  showCustomBadge?: boolean;
  customBadgeUrl?: string;
}

export interface StatusBarConfig {
  showStatusBar: boolean;
  time: string;
  batteryLevel: number; // 0 - 100
  showBatteryPercent: boolean;
  isCharging: boolean;
  wifiEnabled: boolean;
  wifiStrength: number; // 1 to 4
  mobileDataEnabled: boolean;
  signalStrength: number; // 1 to 5
  networkType: '5G' | '4G' | 'LTE' | '3G' | 'VoLTE' | 'none';
  showNotificationIcon: boolean;
  notificationType: 'message' | 'mail' | 'call' | 'dot' | 'whatsapp' | 'telegram' | 'facebook' | 'instagram' | 'discord';
  showAlarm: boolean;
  showLocation: boolean;
  showBluetooth: boolean;
  style: 'android' | 'ios';
  darkModeIcons: boolean;
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  opacity: number; // 0.1 to 1
  fontSize: number; // 10 to 32
}

export interface ThemeConfig {
  preset: 'reference_purple' | 'whatsapp_dark' | 'whatsapp_light' | 'amoled_black' | 'whatsapp_business' | 'custom';
  name: string;
  isDarkMode: boolean;
  headerBg: string;
  chatBg: string;
  incomingBubbleBg: string;
  incomingTextColor: string;
  incomingTimeColor: string;
  outgoingBubbleBg: string;
  outgoingTextColor: string;
  outgoingTimeColor: string;
  inputBarBg: string;
  inputTextColor: string;
  accentColor: string;
  fontFamily: 'default' | 'cursive' | 'script' | 'kalam' | 'roboto';
}

export interface WallpaperConfig {
  type: 'image' | 'solid' | 'doodle';
  imageUrl?: string;
  opacity: number; // 0 to 1
  blur: number; // 0 to 20 px
  darkness: number; // 0 to 1
  zoom: number; // 1 to 2
}

export interface DeviceFrameConfig {
  type: 'galaxy' | 'iphone' | 'frameless';
  showDeviceBezels: boolean;
  showNavigationBar: boolean;
}
