export enum Screen {
  Auth = 'AUTH',
  Home = 'HOME',
  Input = 'INPUT',
  Simulation = 'SIMULATION',
  Report = 'REPORT',
  Diary = 'DIARY',
}

export const EMOTIONS = [
  // 긍정 (Positive)
  '기쁨', '행복', '설렘', '뿌듯함', '만족', '감사', '희망', '사랑', '자신감', '편안함',
  // 부정 (Negative)
  '슬픔', '실망', '좌절', '상처', '후회', '외로움', '무기력',
  '분노', '억울함', '미움', '질투',
  '두려움', '불안', '당황',
  '죄책감', '수치심',
  // 중립 (Neutral)
  '놀람', '궁금함'
] as const;


export type Emotion = typeof EMOTIONS[number];

export interface User {
  id?: number;
  loginId: string;
  accessToken: string;
  tokenType: string;
  email?: string;
  name?: string;
  username?: string;
}

export interface Situation {
  id: string;
  date: string;
  whatHappened: string;
  emotions: Emotion[];
  emotionIntensity: number;
  whatYouDid: string;
  howYouWishItHadGone: string;
  personaName: string;
  personaTone: string;
  personaPersonality: string;
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export interface Report {
  summary: string;
  keyInsights: string[];
  suggestedPhrases: string[];
}

export interface Reflection extends Situation {
  conversation: Message[];
  report: Report | null;
}

export interface AppState {
    screen: Screen;
    user: User | null;
    diary: Reflection[];
    currentReflection: Reflection | null;
    viewingReflection: Reflection | null;
}
