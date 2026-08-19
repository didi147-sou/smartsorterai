import {
  Mail,
  MessageCircle,
  Twitter,
  Slack,
  Bot,
  Send,
  AtSign,
} from 'lucide-react';
import { Source } from '@/types';

const SOURCE_CONFIG: Record<Source, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  Gmail: { icon: Mail, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  WhatsApp: { icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Twitter: { icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  Threads: { icon: AtSign, color: 'text-zinc-300', bg: 'bg-zinc-500/20', border: 'border-zinc-500/30' },
  ChatGPT: { icon: Bot, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  Telegram: { icon: Send, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  Slack: { icon: Slack, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

interface Props {
  source: Source;
  size?: 'sm' | 'md';
}

export default function SourceIcon({ source, size = 'md' }: Props) {
  const config = SOURCE_CONFIG[source];
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 13 : 17;
  const padding = size === 'sm' ? 'p-1.5' : 'p-2.5';

  return (
    <div className={`${padding} ${config.bg} ${config.border} border rounded-xl flex-shrink-0`}>
      <Icon size={iconSize} className={config.color} strokeWidth={2} />
    </div>
  );
}

export { SOURCE_CONFIG };
