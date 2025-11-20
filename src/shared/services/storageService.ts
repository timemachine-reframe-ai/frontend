import { Reflection, User } from '../types';

export const CURRENT_USER_KEY = 'currentUser';
const diaryKey = (identifier: string | number) => `diary_${identifier}`;

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const loadCurrentUser = (): User | null => {
  const rawUser = safeParse<Partial<User> & { email?: string }>(
    localStorage.getItem(CURRENT_USER_KEY),
  );
  if (!rawUser) return null;

  const loginId = rawUser.loginId || rawUser.email;
  if (!loginId || !rawUser.accessToken) {
    return null;
  }

  return {
    id: rawUser.id,
    loginId,
    accessToken: rawUser.accessToken,
    tokenType: rawUser.tokenType && rawUser.tokenType.length > 0 ? rawUser.tokenType : 'Bearer',
    name: rawUser.name,
    username: rawUser.username,
    email: rawUser.email,
  };
};

export const saveCurrentUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

const getPrimaryDiaryKey = (user: User): string | null => {
  if (user.id != null) return String(user.id);
  if (user.loginId) return user.loginId;
  if (user.email) return user.email;
  return null;
};

const getDiaryKeys = (user: User): string[] => {
  const keys: string[] = [];
  if (user.id != null) keys.push(String(user.id));
  if (user.loginId) keys.push(user.loginId);
  if (user.email && user.email !== user.loginId) keys.push(user.email);
  return keys;
};

export const loadDiary = (user: User): Reflection[] => {
  const keys = getDiaryKeys(user);
  const primaryKey = getPrimaryDiaryKey(user);
  for (const key of keys) {
    const diary = safeParse<Reflection[]>(localStorage.getItem(diaryKey(key)));
    if (diary) {
      // Migrate legacy diary data to the preferred key (id > loginId > email)
      if (primaryKey && key !== primaryKey) {
        localStorage.setItem(diaryKey(primaryKey), JSON.stringify(diary));
      }
      return diary;
    }
  }
  return [];
};

export const saveDiary = (user: User, diary: Reflection[]) => {
  const key = getPrimaryDiaryKey(user);
  if (!key) return;
  localStorage.setItem(diaryKey(key), JSON.stringify(diary));
};
