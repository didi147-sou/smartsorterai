import { useState, useMemo } from 'react';
import { Plus, Inbox, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Message, Source, Priority } from '@/types';
import { analyzeMessage, sortMessages } from '@/sorter';
import { INITIAL_MESSAGES } from '@/data';
import MessageCard from '@/components/MessageCard';
import MessageDetail from '@/components/MessageDetail';
import ComposeModal from '@/components/ComposeModal';
import StatsBar from '@/components/StatsBar';

type PriorityFilter = Priority | 'all';
type SourceFilter = Source | 'all';

const ALL_SOURCES: (Source | 'all')[] = ['all', 'Gmail', 'WhatsApp', 'Threads', 'Twitter', 'ChatGPT', 'Telegram', 'Slack'];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => sortMessages(INITIAL_MESSAGES));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const selectedMessage = messages.find((m) => m.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    let list = messages;
    if (priorityFilter !== 'all') list = list.filter((m) => m.priority === priorityFilter);
    if (sourceFilter !== 'all') list = list.filter((m) => m.source === sourceFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.sender.toLowerCase().includes(q) ||
          m.text.toLowerCase().includes(q) ||
          m.source.toLowerCase().includes(q),
      );
    }
    return list;
  }, [messages, priorityFilter, sourceFilter, search]);

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleMarkRead(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  }

  function handleAdd(source: Source, sender: string, text: string) {
    const newMsg = analyzeMessage({
      id: crypto.randomUUID(),
      source,
      sender,
      text,
      timestamp: new Date(),
      isRead: false,
    });
    setMessages((prev) => sortMessages([newMsg, ...prev]));
    setSelectedId(newMsg.id);
  }

  const PRIORITY_TABS: { value: PriorityFilter; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'high', label: '🔴 Главное' },
    { value: 'medium', label: '🟡 План' },
    { value: 'low', label: '🟢 Прочее' },
  ];

  const hasActiveFilters = priorityFilter !== 'all' || sourceFilter !== 'all' || search !== '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-none">
                Умный Inbox AI
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Сортировка сообщений и дедлайнов</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((f) => !f)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal size={17} />
            </button>

            <button
              onClick={() => setShowCompose(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        {showFilters && (
          <div className="border-t border-slate-800 px-4 sm:px-6 py-3 flex flex-col gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по сообщениям или авторам..."
                className="w-full sm:max-w-sm pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Source filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {ALL_SOURCES.map((src) => (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(src)}
                    className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all ${
                      sourceFilter === src
                        ? 'bg-slate-800 text-white border-blue-500'
                        : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {src === 'all' ? 'Все источники' : src}
                  </button>
                ))}
              </div>

              {/* Priority tabs */}
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {PRIORITY_TABS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPriorityFilter(value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      priorityFilter === value
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Left panel */}
          <div className={`flex-1 min-w-0 flex flex-col gap-5 ${selectedMessage ? 'hidden lg:flex' : 'flex'}`}>
            {/* Stats */}
            <StatsBar messages={messages} />

            {/* Messages */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Inbox size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold text-slate-400">
                    {filtered.length} {filtered.length === 1 ? 'сообщение' : 'сообщений'}
                  </span>
                  {hasActiveFilters && (
                    <span className="text-xs text-slate-600">— отфильтровано</span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setPriorityFilter('all'); setSourceFilter('all'); setSearch(''); }}
                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-slate-600">
                    <Inbox size={36} className="mx-auto mb-3 opacity-40" />
                    <p className="font-medium text-sm">Сообщений не найдено</p>
                    <p className="text-xs mt-1">Попробуйте изменить фильтры</p>
                  </div>
                ) : (
                  filtered.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      onClick={handleSelect}
                      isSelected={msg.id === selectedId}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right panel — detail view */}
          {selectedMessage && (
            <div className="w-full lg:w-96 xl:w-[420px] flex-shrink-0">
              <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden flex flex-col">
                <MessageDetail
                  message={selectedMessage}
                  onClose={() => setSelectedId(null)}
                  onMarkRead={handleMarkRead}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose modal */}
      {showCompose && (
        <ComposeModal onClose={() => setShowCompose(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
