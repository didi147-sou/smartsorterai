import { AlertCircle, AlertTriangle, Circle, Mail } from 'lucide-react';
import { Message } from '@/types';

interface Props {
  messages: Message[];
}

export default function StatsBar({ messages }: Props) {
  const high = messages.filter((m) => m.priority === 'high').length;
  const medium = messages.filter((m) => m.priority === 'medium').length;
  const low = messages.filter((m) => m.priority === 'low').length;
  const unread = messages.filter((m) => !m.isRead).length;

  const stats = [
    { label: 'Срочно', value: high, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: 'План', value: medium, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Прочее', value: low, icon: Circle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Непрочитано', value: unread, icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
        <div
          key={label}
          className={`flex items-center gap-3 p-3.5 rounded-2xl ${bg} border ${border}`}
        >
          <div className={color}>
            <Icon size={18} strokeWidth={2} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 leading-none">{value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
