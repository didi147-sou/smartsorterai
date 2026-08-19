import { Priority } from '@/types';

const CONFIG: Record<Priority, { label: string; classes: string; dot: string }> = {
  high: {
    label: '🔴 Главное',
    classes: 'bg-red-500/15 text-red-400 border border-red-500/25',
    dot: 'bg-red-500 animate-pulse',
  },
  medium: {
    label: '🟡 План',
    classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    dot: 'bg-amber-500',
  },
  low: {
    label: '🟢 Прочее',
    classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    dot: 'bg-emerald-500',
  },
};

interface Props {
  priority: Priority;
}

export default function PriorityBadge({ priority }: Props) {
  const { label, classes, dot } = CONFIG[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
