import { Clock, Key, Calendar } from 'lucide-react';
import { Message } from '@/types';
import SourceIcon from '@/components/SourceIcon';
import PriorityBadge from '@/components/PriorityBadge';

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} ч назад`;
  return `${Math.floor(diffHrs / 24)} дн назад`;
}

const PRIORITY_BORDER: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-emerald-500',
};

interface Props {
  message: Message;
  onClick: (id: string) => void;
  isSelected: boolean;
}

export default function MessageCard({ message, onClick, isSelected }: Props) {
  const borderColor = PRIORITY_BORDER[message.priority];

  return (
    <div
      onClick={() => onClick(message.id)}
      className={`
        group relative flex gap-3 p-4 rounded-2xl border-l-4 bg-slate-900/80 cursor-pointer
        transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800/80
        ${borderColor} border-slate-800
        ${isSelected ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' : 'hover:shadow-lg hover:shadow-black/20'}
        ${!message.isRead ? 'shadow-md' : 'opacity-60'}
      `}
    >
      {!message.isRead && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
      )}

      <SourceIcon source={message.source} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-200 text-xs">{message.sender}</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-slate-500 flex-shrink-0 mt-0.5">
            <Clock size={10} />
            {timeAgo(message.timestamp)}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-2.5">
          {message.text}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <PriorityBadge priority={message.priority} />

          {message.extractedDeadlines.slice(0, 1).map((d) => (
            <span
              key={d}
              className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md font-medium"
            >
              <Calendar size={10} />
              {d}
            </span>
          ))}

          {message.keyInfo.slice(0, 2).map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md font-medium"
            >
              <Key size={9} />
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
