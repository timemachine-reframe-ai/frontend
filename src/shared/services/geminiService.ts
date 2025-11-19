import { Reflection, Report, Message } from '../types';

const API_BASE =
  (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:8000';

const CHAT_ENDPOINT = `${API_BASE}/api/reflections/chat`;
const REPORT_ENDPOINT = `${API_BASE}/api/reflections/reports`;

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const detail = (data && data.detail) || '요청 처리 중 오류가 발생했습니다.';
    throw new Error(detail);
  }
  return response.json();
};

const formatConversationLines = (conversation: Message[]): string => {
  if (!conversation.length) return '';
  return conversation
    .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
    .join('\n');
};

const buildConversationContext = (reflection: Reflection, conversation: Message[]): string => {
  const sections = [
    `What Happened: ${reflection.whatHappened}`,
    `Emotions: ${reflection.emotions.join(', ')}`,
    `What You Did: ${reflection.whatYouDid}`,
    `Desired Outcome: ${reflection.howYouWishItHadGone}`,
  ];
  const conversationText = formatConversationLines(conversation);
  if (conversationText) {
    sections.push('Conversation:');
    sections.push(conversationText);
  }
  return sections.join('\n');
};

type ReportGenerationResponse = {
  report_id: number;
  session_id: string;
  status: string;
  failure_reason?: string | null;
  report_json?: {
    summary?: string;
    keyInsights?: string[];
    suggestedPhrases?: string[];
  } | null;
};

export const generateReport = async (
  reflection: Reflection,
  conversation: Message[],
): Promise<Report> => {
  const payload = {
    sessionId: reflection.id,
    conversationContext: buildConversationContext(reflection, conversation),
  };

  const response = await fetch(REPORT_ENDPOINT, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  const data: ReportGenerationResponse = await handleResponse(response);
  if (data.status !== 'finished' || !data.report_json) {
    const reason = data.failure_reason ?? '보고서를 생성하지 못했습니다.';
    throw new Error(reason);
  }
  const reportJson = data.report_json ?? {};
  return {
    summary: reportJson.summary ?? '',
    keyInsights: reportJson.keyInsights ?? [],
    suggestedPhrases: reportJson.suggestedPhrases ?? [],
  };
};

export const requestChatReply = async (
  reflection: Reflection,
  conversation: Message[],
  userMessage: string,
): Promise<string> => {
  const payload = {
    whatHappened: reflection.whatHappened,
    emotions: reflection.emotions,
    whatYouDid: reflection.whatYouDid,
    howYouWishItHadGone: reflection.howYouWishItHadGone,
    personaName: reflection.personaName,
    personaTone: reflection.personaTone,
    personaPersonality: reflection.personaPersonality,
    conversation,
    message: userMessage,
  };

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(response);
  return data.reply ?? '';
};
