import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Message, Reflection, Screen, Situation, User } from '@/shared/types';
import { fetchReportHistory, generateReport, deleteReflection as deleteReflectionApi } from '@/shared/services/geminiService';
import { clearCurrentUser, loadCurrentUser, saveCurrentUser } from '@/shared/services/storageService';

interface AppActions {
  navigate: (screen: Screen) => void;
  goToAuth: () => void;
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
  deleteReflection: (id: string) => Promise<void>;
}

export const useReflectionApp = () => {
  const [state, setState] = useState<AppState>({
    screen: Screen.Home,
    user: null,
    diary: [],
    currentReflection: null,
    viewingReflection: null,
  });

  const diaryRefreshInFlight = useRef(false);
  const refreshDiary = useCallback(async () => {
    if (diaryRefreshInFlight.current) return;
    diaryRefreshInFlight.current = true;
    try {
      const diaryFromServer = await fetchReportHistory();
      setState(prev => ({ ...prev, diary: diaryFromServer }));
    } catch (error) {
      console.error('Failed to load diary from server:', error);
    } finally {
      diaryRefreshInFlight.current = false;
    }
  }, []);

  const initialDiaryRequested = useRef(false);
  useEffect(() => {
    const storedUser = loadCurrentUser();
    if (storedUser) {
      setState(prev => ({
        ...prev,
        user: storedUser,
        screen: Screen.Home,
      }));
      if (!initialDiaryRequested.current) {
        initialDiaryRequested.current = true;
        void refreshDiary();
      }
    }
  }, [refreshDiary]);

  const navigate = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const goToAuth = useCallback(() => {
    setState(prev => ({ ...prev, screen: Screen.Auth }));
  }, []);

  const handleLogin = useCallback(
    (user: User) => {
      saveCurrentUser(user);
      setState(prev => ({
        ...prev,
        user,
        screen: Screen.Home,
      }));
      void refreshDiary();
    },
    [refreshDiary],
  );

  const handleLogout = useCallback(() => {
    clearCurrentUser();
    setState({
      screen: Screen.Home,
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
        const report = await generateReport(reflectionSnapshot, conversation);
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
    let userForRefresh: User | null = null;
    setState(prev => {
      if (!prev.currentReflection || !prev.user) return prev;
      userForRefresh = prev.user;
      return {
        ...prev,
        currentReflection: null,
        screen: Screen.Diary,
      };
    });

    if (userForRefresh) {
      void refreshDiary();
    }
  }, [refreshDiary]);

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

  const deleteReflection = useCallback(async (id: string) => {
    try {
      await deleteReflectionApi(id);
      setState(prev => ({
        ...prev,
        diary: prev.diary.filter(item => item.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete reflection:', error);
      // Optimistically delete from local state even if server fails?
      // Or show error? For now, let's assume if it fails, we don't update UI to keep sync.
      // But to be user friendly, maybe we should just update local state if it's a 404 or similar.
      // Let's stick to simple error logging for now.
      alert('회고 삭제에 실패했습니다.');
    }
  }, []);

  const actions: AppActions = {
    navigate,
    goToAuth,
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
    deleteReflection,
  };

  return { state, actions };
};
