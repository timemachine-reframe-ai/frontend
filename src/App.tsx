import React, { useState, useEffect } from 'react';
import { Screen, Reflection, AppState, Situation, Message, User } from './types';
import HomeScreen from './screens/HomeScreen';
import SituationInputScreen from './screens/SituationInputScreen';
import SimulationScreen from './screens/SimulationScreen';
import ReportScreen from './screens/ReportScreen';
import DiaryScreen from './screens/DiaryScreen';
import AuthScreen from './screens/AuthScreen';
import { generateReport } from './services/geminiService';
import BackButton from './components/BackButton';

export default function App() {
  const [state, setState] = useState<AppState>({
    screen: Screen.Auth,
    user: null,
    diary: [],
    currentReflection: null,
    viewingReflection: null,
  });

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      const userDiary = JSON.parse(localStorage.getItem(`diary_${user.email}`) || '[]');
      setState(prev => ({
        ...prev,
        user,
        diary: userDiary,
        screen: Screen.Home,
      }));
    }
  }, []);

  const navigate = (screen: Screen) => {
    setState(prev => ({ ...prev, screen }));
  };

  const handleLogin = (user: User) => {
    const userDiary = JSON.parse(localStorage.getItem(`diary_${user.email}`) || '[]');
    localStorage.setItem('currentUser', JSON.stringify(user));
    setState(prev => ({
      ...prev,
      user,
      diary: userDiary,
      screen: Screen.Home,
    }));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setState({
      screen: Screen.Auth,
      user: null,
      diary: [],
      currentReflection: null,
      viewingReflection: null,
    });
  };

  const startNewReflection = () => {
    setState(prev => ({
      ...prev,
      screen: Screen.Input,
      currentReflection: null,
      viewingReflection: null,
    }));
  };

  const startSimulation = (situation: Omit<Situation, 'id' | 'date'>) => {
    const newReflection: Reflection = {
      ...situation,
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      conversation: [],
      report: null,
    };

    setState(prev => ({
      ...prev,
      currentReflection: newReflection,
      screen: Screen.Simulation,
    }));
  };

  const endSimulation = async (conversation: Message[]) => {
      if (!state.currentReflection) return;
      
      const updatedReflection = { ...state.currentReflection, conversation };
      setState(prev => ({ ...prev, currentReflection: updatedReflection, screen: Screen.Report }));

      try {
        const report = await generateReport(updatedReflection);
        setState(prev => (prev.currentReflection ? { ...prev, currentReflection: { ...prev.currentReflection, report } } : prev));
      } catch (error) {
        console.error("Failed to generate report:", error);
      }
  };

  const saveToDiary = () => {
      if (!state.currentReflection || !state.user) return;
      
      const newDiary = [...state.diary, state.currentReflection];
      localStorage.setItem(`diary_${state.user.email}`, JSON.stringify(newDiary));

      setState(prev => ({
          ...prev,
          diary: newDiary,
          currentReflection: null,
          screen: Screen.Diary,
      }));
  };
  
  const viewReport = (reflection: Reflection) => {
      setState(prev => ({ ...prev, viewingReflection: reflection, screen: Screen.Report }));
  };

  const renderContent = () => {
    if (!state.user) {
        return <AuthScreen onLogin={handleLogin} />;
    }
    
    switch (state.screen) {
      case Screen.Input:
        return <SituationInputScreen onStartSimulation={startSimulation} onBack={() => navigate(Screen.Home)} />;
      case Screen.Simulation:
        if (state.currentReflection) {
          return <SimulationScreen reflection={state.currentReflection} onEndSimulation={endSimulation} />;
        }
        return <HomeScreen user={state.user} onStart={startNewReflection} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} />;
      case Screen.Report:
        const reflectionToView = state.viewingReflection || state.currentReflection;
        if (reflectionToView) {
            return <ReportScreen 
                reflection={reflectionToView} 
                onSave={state.viewingReflection ? undefined : saveToDiary}
                onHome={() => state.viewingReflection ? navigate(Screen.Diary) : navigate(Screen.Home)}
            />;
        }
        return <HomeScreen user={state.user} onStart={startNewReflection} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} />;
      case Screen.Diary:
        return <DiaryScreen diary={state.diary} onViewReport={viewReport} onNewReflection={startNewReflection} onLogout={handleLogout} />;
      case Screen.Home:
      default:
        return <HomeScreen user={state.user} onStart={startNewReflection} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} />;
    }
  };

  const backAction = (() => {
    switch (state.screen) {
      case Screen.Input:
        return () => navigate(Screen.Home);
      case Screen.Simulation:
        return () =>
          setState(prev => ({
            ...prev,
            screen: Screen.Home,
            currentReflection: null,
          }));
      case Screen.Report:
        if (state.viewingReflection) {
          return () =>
            setState(prev => ({
              ...prev,
              screen: Screen.Diary,
              viewingReflection: null,
            }));
        }
        return () =>
          setState(prev => ({
            ...prev,
            screen: Screen.Home,
            viewingReflection: null,
          }));
      case Screen.Diary:
        return () => navigate(Screen.Home);
      default:
        return null;
    }
  })();

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex items-center justify-center">
      <div className="container mx-auto max-w-5xl p-4 w-full relative pt-12">
        {backAction && (
          <div className="absolute left-4 top-4">
            <BackButton onClick={backAction} />
          </div>
        )}
        <div className="pt-4">{renderContent()}</div>
      </div>
    </div>
  );
}
