import React from 'react';
import { Screen, Reflection } from '@/shared/types';
import HomeScreen from '@/features/home/HomeScreen';
import SituationInputScreen from '@/features/input/SituationInputScreen';
import SimulationScreen from '@/features/simulation/SimulationScreen';
import ReportScreen from '@/features/report/ReportScreen';
import DiaryScreen from '@/features/diary/DiaryScreen';
import AuthScreen from '@/features/auth/AuthScreen';
import BackButton from '@/shared/components/BackButton';
import { useReflectionApp } from '@/features/reflection/hooks/useReflectionApp';

export default function App() {
  const { state, actions } = useReflectionApp();
  const { user, screen, currentReflection, viewingReflection, diary } = state;
  const {
    handleLogin,
    handleLogout,
    startNewReflection,
    startSimulation,
    endSimulation,
    saveToDiary,
    viewReport,
    navigate,
    backFromSimulation,
    backFromViewingReport,
    backFromReportToHome,
  } = actions;

  const renderContent = () => {
    if (!user) {
        return <AuthScreen onLogin={handleLogin} />;
    }
    
    switch (screen) {
      case Screen.Input:
        return <SituationInputScreen onStartSimulation={startSimulation} onBack={() => navigate(Screen.Home)} />;
      case Screen.Simulation:
        if (currentReflection) {
          return <SimulationScreen reflection={currentReflection} onEndSimulation={endSimulation} />;
        }
        return <HomeScreen user={user} onStart={startNewReflection} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} />;
      case Screen.Report:
        const reflectionToView: Reflection | null = viewingReflection || currentReflection;
        if (reflectionToView) {
            return <ReportScreen 
                reflection={reflectionToView} 
                onSave={viewingReflection ? undefined : saveToDiary}
                onHome={() => viewingReflection ? navigate(Screen.Diary) : navigate(Screen.Home)}
            />;
        }
        return <HomeScreen user={user} onStart={startNewReflection} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} />;
      case Screen.Diary:
        return <DiaryScreen diary={diary} onViewReport={viewReport} onNewReflection={startNewReflection} onLogout={handleLogout} />;
      case Screen.Home:
      default:
        return <HomeScreen user={user} onStart={startNewReflection} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} />;
    }
  };

  const backAction = (() => {
    switch (screen) {
      case Screen.Input:
        return () => navigate(Screen.Home);
      case Screen.Simulation:
        return () =>
          backFromSimulation();
      case Screen.Report:
        if (viewingReflection) {
          return () =>
            backFromViewingReport();
        }
        return () =>
          backFromReportToHome();
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
