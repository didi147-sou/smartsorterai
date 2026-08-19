import { Message, Source } from '@/types';
import { analyzeMessage } from '@/sorter';

function msg(
  id: string,
  source: Source,
  sender: string,
  text: string,
  minutesAgo: number,
): Message {
  return analyzeMessage({
    id,
    source,
    sender,
    text,
    timestamp: new Date(Date.now() - minutesAgo * 60 * 1000),
    isRead: false,
  });
}

export const INITIAL_MESSAGES: Message[] = [
  msg('1', 'Gmail', 'клиент@corp.com', 'Привет! Нам нужно срочно подписать договор до 18:00 сегодня.', 5),
  msg('2', 'WhatsApp', 'Мама', 'Привет, как дела? Посмотри смешное видео с котиками.', 45),
  msg('3', 'Twitter', '@tech_news', 'Вышло новое обновление платформы! Проверь детали в блоге.', 60),
  msg('4', 'Threads', 'Коллега', 'Привет! Завтра в 12:00 будет проектный митинг по релизу.', 30),
  msg('5', 'ChatGPT', 'System Alert', 'Превышен лимит запросов, обнаружена критическая ошибка 429.', 15),
  msg('6', 'Gmail', 'ceo@startup.com', 'Срочно требуется проверить баланс и оплата счетов до 15:00!', 12),
  msg('7', 'Threads', 'DevTeam', 'Релиз перенесен, возник критический баг в продакшене.', 20),
  msg('8', 'WhatsApp', 'Алексей', 'Встретимся завтра за кофе? Дай знать как будет удобно.', 90),
  msg('9', 'Telegram', 'Менеджер', 'Напоминаю про совещание в пятницу в 10:00. Важно быть вовремя.', 120),
  msg('10', 'Slack', 'HR Department', 'Проверь обновление по проекту — задача на релиз почти готова.', 180),
];
