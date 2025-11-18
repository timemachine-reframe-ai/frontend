import { Reflection, Report, Message } from '../types';

const API_BASE =
  (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:8000';

const SUMMARY_ENDPOINT = `${API_BASE}/api/reflections/summary`;
const CHAT_ENDPOINT = `${API_BASE}/api/reflections/chat`;

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

export const generateReport = async (reflection: Reflection): Promise<Report> => {
  const payload = {
    whatHappened: reflection.whatHappened,
    emotions: reflection.emotions,
    whatYouDid: reflection.whatYouDid,
    howYouWishItHadGone: reflection.howYouWishItHadGone,
  };

  const response = await fetch(SUMMARY_ENDPOINT, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(response);
  return {
    summary: data.summary ?? '',
    keyInsights: data.keyInsights ?? [],
    suggestedPhrases: data.suggestedPhrases ?? [],
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
