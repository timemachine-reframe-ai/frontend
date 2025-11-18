import { useCallback, useEffect, useState } from 'react';
import { AppState, Message, Reflection, Screen, Situation, User } from '@/shared/types';
import { generateReport } from '@/shared/services/geminiService';
import {
  clearCurrentUser,
  loadCurrentUser,
  loadDiary,
  saveCurrentUser,
  saveDiary,
} from '@/shared/services/storageService';

interface AppActions {
  navigate: (screen: Screen) => void;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
  startNewReflection: () => void;
  startSimulation: (situation: Omit<Situation, 'id' | 'date'>) => void;
  endSimulation: (conversation: Message[]) => Promise<void>;
  saveToDiary: () => void;
  viewReport: (reflection: Reflection) => void;
  backFromSimulation: () => void;
  backFromViewingReport: () => void;
  backFromReportToHome: () => void;
}

export const useReflectionApp = () => {
  const [state, setState] = useState<AppState>({
    screen: Screen.Auth,
    user: null,
    diary: [],
    currentReflection: null,
    viewingReflection: null,
  });

  useEffect(() => {
    const storedUser = loadCurrentUser();
    if (storedUser) {
      const diary = loadDiary(storedUser.email);
      setState(prev => ({
        ...prev,
        user: storedUser,
        diary,
        screen: Screen.Home,
      }));
    }
  }, []);

  const navigate = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const handleLogin = useCallback((user: User) => {
    const diary = loadDiary(user.email);
    saveCurrentUser(user);
    setState(prev => ({
      ...prev,
      user,
      diary,
      screen: Screen.Home,
    }));
  }, []);

  const handleLogout = useCallback(() => {
    clearCurrentUser();
    setState({
      screen: Screen.Auth,
      user: null,
      diary: [],
      currentReflection: null,
      viewingReflection: null,
    });
  }, []);

  const startNewReflection = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: Screen.Input,
      currentReflection: null,
      viewingReflection: null,
    }));
  }, []);

  const startSimulation = useCallback((situation: Omit<Situation, 'id' | 'date'>) => {
    const newReflection: Reflection = {
      ...situation,
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      conversation: [],
      report: null,
    };

    setState(prev => ({
      ...prev,
      currentReflection: newReflection,
      screen: Screen.Simulation,
    }));
  }, []);

  const endSimulation = useCallback(
    async (conversation: Message[]) => {
      let reflectionSnapshot: Reflection | null = null;
      setState(prev => {
        if (!prev.currentReflection) return prev;
        const updatedReflection = { ...prev.currentReflection, conversation };
        reflectionSnapshot = updatedReflection;
        return { ...prev, currentReflection: updatedReflection, screen: Screen.Report };
      });

      if (!reflectionSnapshot) return;

      try {
        const report = await generateReport(reflectionSnapshot);
        setState(prev =>
          prev.currentReflection
            ? { ...prev, currentReflection: { ...prev.currentReflection, report } }
            : prev,
        );
      } catch (error) {
        console.error('Failed to generate report:', error);
      }
    },
    [],
  );

  const saveToDiary = useCallback(() => {
    let nextDiary: Reflection[] | null = null;
    let userEmail: string | null = null;

    setState(prev => {
      if (!prev.currentReflection || !prev.user) return prev;
      const updatedDiary = [...prev.diary, prev.currentReflection];
      nextDiary = updatedDiary;
      userEmail = prev.user.email;
      return {
        ...prev,
        diary: updatedDiary,
        currentReflection: null,
        screen: Screen.Diary,
      };
    });

    if (nextDiary && userEmail) {
      saveDiary(userEmail, nextDiary);
    }
  }, []);

  const viewReport = useCallback((reflection: Reflection) => {
    setState(prev => ({
      ...prev,
      viewingReflection: reflection,
      screen: Screen.Report,
    }));
  }, []);

  const backFromSimulation = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: Screen.Home,
      currentReflection: null,
    }));
  }, []);

  const backFromViewingReport = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: Screen.Diary,
      viewingReflection: null,
    }));
  }, []);

  const backFromReportToHome = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: Screen.Home,
      viewingReflection: null,
    }));
  }, []);

  const actions: AppActions = {
    navigate,
    handleLogin,
    handleLogout,
    startNewReflection,
    startSimulation,
    endSimulation,
    saveToDiary,
    viewReport,
    backFromSimulation,
    backFromViewingReport,
    backFromReportToHome,
  };

  return { state, actions };
};
