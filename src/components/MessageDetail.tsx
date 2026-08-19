import { X, Calendar, Key, Clock, CheckCheck } from 'lucide-react';
import { Message } from '@/types';
import SourceIcon from '@/components/SourceIcon';
import PriorityBadge from '@/components/PriorityBadge';

function formatTime(date: Date): string {
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  message: Message;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

export default function MessageDetail({ message, onClose, onMarkRead }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Детали сообщения
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Source & Sender */}
        <div className="flex items-start gap-3">
          <SourceIcon source={message.source} size="md" />
          <div>
            <div className="font-semibold text-slate-100 text-sm">{message.sender}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span className="text-slate-400">{message.source}</span>
              <span>·</span>
              <Clock size={11} />
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>

        {/* Priority */}
        <div>
          <PriorityBadge priority={message.priority} />
        </div>

        {/* Message body */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
          <p className="text-slate-300 text-sm leading-relaxed">{message.text}</p>
        </div>

        {/* Deadlines */}
        {message.extractedDeadlines.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Найденные дедлайны
            </div>
            <div className="flex flex-wrap gap-2">
              {message.extractedDeadlines.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl font-medium"
                >
                  <Calendar size={13} />
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key info */}
        {message.keyInfo.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Ключевые метки
            </div>
            <div className="flex flex-wrap gap-2">
              {message.keyInfo.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl"
                >
                  <Key size={12} />
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer action */}
      {!message.isRead && (
        <div className="px-5 py-4 border-t border-slate-800">
          <button
            onClick={() => onMarkRead(message.id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <CheckCheck size={16} />
            Отметить прочитанным
          </button>
        </div>
      )}
    </div>
  );
}
