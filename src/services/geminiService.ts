import { GoogleGenAI, Chat, Type, GenerateContentResponse } from '@google/genai';
import { Reflection, Report } from '../types';

const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
};

export const startChatSession = async (reflection: Reflection): Promise<Chat> => {
  const {
    whatHappened,
    emotions,
    whatYouDid,
    howYouWishItHadGone,
    personaName,
    personaTone,
    personaPersonality,
  } = reflection;

  const systemInstruction = `
    당신은 지금부터 '${personaName}' 역할을 수행하는 AI입니다.
    당신의 성격은 '${personaPersonality}'이며, 말투는 '${personaTone}'입니다.
    사용자는 특정 상황을 다시 재현하고 싶어합니다.
    
    상황에 대한 정보는 다음과 같습니다:
    - 발생한 일: ${whatHappened}
    - 사용자가 느낀 감정: ${emotions.join(', ')}
    - 사용자의 실제 반응: ${whatYouDid}
    - 사용자가 바랐던 결과: ${howYouWishItHadGone}

    당신의 목표는 '${personaName}'의 역할을 유지하며 대화를 시뮬레이션하는 것입니다.
    사용자와의 대화를 통해 어떻게 다르게 대화할 수 있었는지 탐색할 수 있도록 도와주세요.
    사용자가 먼저 대화를 시작할 것입니다. 사용자의 첫 메시지를 기다렸다가 '${personaName}'의 입장에서 응답해주세요.
    `;

  const chat = getClient().chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return chat;
};

export const generateReport = async (reflection: Reflection): Promise<Report> => {
  const { conversation } = reflection;

  const formattedConversation = conversation
    .map(msg => `${msg.sender === 'user' ? '사용자' : 'AI'}: ${msg.text}`)
    .join('\n');
  
  const prompt = `
    다음은 사용자가 겪은 상황과 그 상황을 바탕으로 진행된 가상 대화 내용입니다. 모든 내용을 종합적으로 분석하여 한국어로 회고 리포트를 생성해주세요.

    [초기 상황 정보]
    - 발생한 일: ${reflection.whatHappened}
    - 사용자가 느낀 감정: ${reflection.emotions.join(', ')}
    - 사용자의 실제 반응: ${reflection.whatYouDid}
    - 사용자가 바랐던 결과: ${reflection.howYouWishItHadGone}

    [가상 대화 내용]
    ${formattedConversation}

    [리포트 생성 지침]
    위 [초기 상황 정보]와 [가상 대화 내용]을 모두 참고하여, 아래 JSON 형식에 맞춰 회고 리포트를 작성해주세요.
    - "summary": 대화의 흐름과 사용자의 감정 여정을 2-3문장으로 요약합니다.
    - "keyInsights": 사용자의 대화 패턴, 감정적 트리거, 성장 지점을 파악하여 3-4개의 핵심 인사이트를箇条書き(bullet points) 형식의 배열로 제공합니다. 특히, 사용자가 '바랐던 결과'를 달성하기 위해 대화에서 어떻게 다르게 행동할 수 있었는지에 대한 분석을 반드시 포함해야 합니다.
    - "suggestedPhrases": 앞으로 비슷한 상황에서 사용자가 활용할 수 있는 구체적인 추천 표현을 2-3개 배열로 제공합니다.
    - 모든 텍스트는 반드시 한국어로 작성되어야 합니다.
    `;

  const response: GenerateContentResponse = await getClient().models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyInsights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          suggestedPhrases: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['summary', 'keyInsights', 'suggestedPhrases'],
      },
    },
  });
  
  const jsonText = response.text.trim();
  const reportData = JSON.parse(jsonText);

  return reportData as Report;
};
