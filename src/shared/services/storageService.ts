import { Reflection, User } from '../types';

const CURRENT_USER_KEY = 'currentUser';
const diaryKey = (email: string) => `diary_${email}`;

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const loadCurrentUser = (): User | null => {
  return safeParse<User>(localStorage.getItem(CURRENT_USER_KEY));
};

export const saveCurrentUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const loadDiary = (email: string): Reflection[] => {
  return safeParse<Reflection[]>(localStorage.getItem(diaryKey(email))) ?? [];
};

export const saveDiary = (email: string, diary: Reflection[]) => {
  localStorage.setItem(diaryKey(email), JSON.stringify(diary));
};
