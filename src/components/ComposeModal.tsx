import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Source } from '@/types';

const SOURCES: Source[] = ['Gmail', 'WhatsApp', 'Threads', 'Twitter', 'ChatGPT', 'Telegram', 'Slack'];

interface Props {
  onClose: () => void;
  onAdd: (source: Source, sender: string, text: string) => void;
}

export default function ComposeModal({ onClose, onAdd }: Props) {
  const [source, setSource] = useState<Source>('Gmail');
  const [sender, setSender] = useState('');
  const [text, setText] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sender.trim() || !text.trim()) return;
    onAdd(source, sender.trim(), text.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Добавить сообщение</h2>
            <p className="text-xs text-slate-500 mt-0.5">Будет проанализировано и отсортировано автоматически</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Source selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Источник
            </label>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    source === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sender */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Отправитель
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="напр. boss@company.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* Message text */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Сообщение
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Вставьте или введите текст для анализа приоритета..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-800 text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
            >
              <Send size={15} />
              Анализировать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
