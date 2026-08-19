import { Message, Priority } from '@/types';

const CRITICAL_KEYWORDS = [
  'urgent', 'deadline', 'payment', 'contract', 'important',
  'meeting', 'problem', 'error', 'bug', 'срочно', 'дедлайн',
  'оплата', 'договор', 'важно', 'совещание', 'встреча',
  'проблема', 'ошибка', 'баг', 'asap', 'critical', 'immediately',
  'overdue', 'final', 'alert', 'warning',
];

const MEDIUM_KEYWORDS = [
  'project', 'task', 'question', 'review', 'release', 'update',
  'проект', 'задача', 'вопрос', 'проверь', 'релиз', 'обновление',
  'follow up', 'reminder', 'action required', 'please', 'could you',
];

const DATE_PATTERNS = [
  /\b\d{1,2}[./]\d{1,2}(?:[./]\d{2,4})?\b/g,
  /\btoday\b|\bтоday\b|\bсегодня\b/gi,
  /\btomorrow\b|\bзавтра\b/gi,
  /\bby \d{1,2}:\d{2}\b/gi,
  /\bat \d{1,2}:\d{2}\b|\bin \d{1,2}:\d{2}\b|\bв \d{1,2}:\d{2}\b|\bдо \d{1,2}:\d{2}\b/gi,
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2}\b/gi,
];

export function extractDeadlines(text: string): string[] {
  const found: string[] = [];
  for (const pattern of DATE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) found.push(...matches);
  }
  return [...new Set(found)];
}

export function extractKeyInfo(text: string): string[] {
  const lower = text.toLowerCase();
  const critical = CRITICAL_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()));
  const medium = MEDIUM_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()));
  return [...new Set([...critical, ...medium])];
}

export function determinePriority(text: string, deadlines: string[], keyInfo: string[]): Priority {
  const lower = text.toLowerCase();
  const hasCritical = CRITICAL_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
  const hasTodayUrgent =
    deadlines.some((d) => /today|сегодня/i.test(d)) ||
    /urgent|asap|срочно|immediately|critical/i.test(lower);

  if (hasCritical || hasTodayUrgent) return 'high';

  const hasMedium = MEDIUM_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
  if (hasMedium || deadlines.length > 0) return 'medium';

  return 'low';
}

export function analyzeMessage(msg: Omit<Message, 'priority' | 'extractedDeadlines' | 'keyInfo'>): Message {
  const deadlines = extractDeadlines(msg.text);
  const keyInfo = extractKeyInfo(msg.text);
  const priority = determinePriority(msg.text, deadlines, keyInfo);
  return { ...msg, priority, extractedDeadlines: deadlines, keyInfo };
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function sortMessages(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
}
