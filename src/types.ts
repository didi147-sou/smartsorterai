export type Source = 'Gmail' | 'WhatsApp' | 'Threads' | 'Twitter' | 'ChatGPT' | 'Telegram' | 'Slack';

export type Priority = 'high' | 'medium' | 'low';

export interface Message {
  id: string;
  source: Source;
  sender: string;
  text: string;
  timestamp: Date;
  priority: Priority;
  extractedDeadlines: string[];
  keyInfo: string[];
  isRead: boolean;
}
