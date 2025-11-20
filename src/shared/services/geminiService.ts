import { Reflection, Report, Message } from '../types';
import { getApiUrl, handleJsonResponse, requireAuthJsonHeaders } from './apiClient';

const CHAT_ENDPOINT = getApiUrl('/api/reflections/chat');
const REPORT_ENDPOINT = getApiUrl('/api/reflections/reports');
const REPORT_LIST_ENDPOINT = REPORT_ENDPOINT;

type ReportListItem = {
  report_id?: number;
  session_id?: string;
  status?: string;
  failure_reason?: string | null;
  report_md?: string | null;
  report_json?: string | null;
  created_at?: string | null;
  processed_at?: string | null;
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

  const headers = requireAuthJsonHeaders();

  const response = await fetch(REPORT_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data: ReportGenerationResponse = await handleJsonResponse(response);
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

const parseReportJson = (raw: unknown): Report => {
  if (!raw) return { summary: '', keyInsights: [], suggestedPhrases: [] };

  try {
    const parsed =
      typeof raw === 'string' ? (JSON.parse(raw) as Record<string, unknown>) : (raw as Record<string, unknown>);
    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      keyInsights: Array.isArray(parsed.keyInsights)
        ? (parsed.keyInsights.filter(item => typeof item === 'string') as string[])
        : [],
      suggestedPhrases: Array.isArray(parsed.suggestedPhrases)
        ? (parsed.suggestedPhrases.filter(item => typeof item === 'string') as string[])
        : [],
    };
  } catch {
    return { summary: '', keyInsights: [], suggestedPhrases: [] };
  }
};

const historyItemToReflection = (item: ReportListItem): Reflection => {
  const baseReport = parseReportJson(item.report_json);
  const summaryFallback =
    baseReport.summary ||
    (typeof item.report_md === 'string' && item.report_md.trim().length > 0
      ? item.report_md
      : '요약이 없습니다.');

  const createdDate = item.created_at ? new Date(item.created_at) : new Date();
  const createdDateText = createdDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    id: item.session_id || String(item.report_id ?? createdDate.getTime()),
    date: createdDateText,
    whatHappened: summaryFallback,
    emotions: [],
    emotionIntensity: 0,
    whatYouDid: '',
    howYouWishItHadGone: '',
    personaName: '',
    personaTone: '',
    personaPersonality: '',
    conversation: [],
    report: {
      summary: summaryFallback,
      keyInsights: baseReport.keyInsights ?? [],
      suggestedPhrases: baseReport.suggestedPhrases ?? [],
    },
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

  const headers = requireAuthJsonHeaders();

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await handleJsonResponse(response);
  return data.reply ?? '';
};

export const fetchReportHistory = async (): Promise<Reflection[]> => {
  const headers = requireAuthJsonHeaders();
  const response = await fetch(REPORT_LIST_ENDPOINT, {
    method: 'GET',
    headers,
  });

  const data = await handleJsonResponse(response);
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(historyItemToReflection);
};
