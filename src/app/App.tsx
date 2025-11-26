import React, { useState } from 'react';
import { Screen, Reflection } from '@/shared/types';
import HomeScreen from '@/features/home/HomeScreen';
import SituationInputScreen from '@/features/input/SituationInputScreen';
import SimulationScreen from '@/features/simulation/SimulationScreen';
import ReportScreen from '@/features/report/ReportScreen';
import DiaryScreen from '@/features/diary/DiaryScreen';
import AuthScreen from '@/features/auth/AuthScreen';
import BackButton from '@/shared/components/BackButton';
import TimeTravelAnimation from '@/shared/components/TimeTravelAnimation';
import { useReflectionApp } from '@/features/reflection/hooks/useReflectionApp';

export default function App() {
  const { state, actions } = useReflectionApp();
  const { user, screen, currentReflection, viewingReflection, diary } = state;
  const {
    goToAuth,
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

  const [isTimeTraveling, setIsTimeTraveling] = useState(false);

  const handleStartWithAnimation = () => {
    setIsTimeTraveling(true);
    setTimeout(() => {
      setIsTimeTraveling(false);
      startNewReflection();
    }, 3000);
  };

  const renderContent = () => {
    if (isTimeTraveling) {
      return <TimeTravelAnimation />;
    }

    if (!user) {
      if (screen === Screen.Auth) {
        return <AuthScreen onLogin={handleLogin} />;
      }
      return (
        <HomeScreen
          user={null}
          onStart={() => goToAuth()}
          onDiary={() => goToAuth()}
          onLogout={() => goToAuth()}
          onLogin={() => goToAuth()}
        />
      );
    }

    switch (screen) {
      case Screen.Input:
        return <SituationInputScreen onStartSimulation={startSimulation} onBack={() => navigate(Screen.Home)} />;
      case Screen.Simulation:
        if (currentReflection) {
          return <SimulationScreen reflection={currentReflection} onEndSimulation={endSimulation} />;
        }
        return <HomeScreen user={user} onStart={handleStartWithAnimation} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} onLogin={() => goToAuth()} />;
      case Screen.Report:
        const reflectionToView: Reflection | null = viewingReflection || currentReflection;
        if (reflectionToView) {
          return <ReportScreen
            reflection={reflectionToView}
            onSave={viewingReflection ? undefined : saveToDiary}
            onHome={() => viewingReflection ? navigate(Screen.Diary) : navigate(Screen.Home)}
          />;
        }
        return <HomeScreen user={user} onStart={handleStartWithAnimation} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} onLogin={() => goToAuth()} />;
      case Screen.Diary:
        return <DiaryScreen diary={diary} onViewReport={viewReport} onNewReflection={handleStartWithAnimation} onLogout={handleLogout} onDelete={actions.deleteReflection} />;
      case Screen.Home:
      default:
        return <HomeScreen user={user} onStart={handleStartWithAnimation} onDiary={() => navigate(Screen.Diary)} onLogout={handleLogout} onLogin={() => goToAuth()} />;
    }
  };

  const backAction = (() => {
    if (isTimeTraveling) return null;

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
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex items-center justify-center selection:bg-primary-100 selection:text-primary-900">
      {isTimeTraveling ? (
        <TimeTravelAnimation />
      ) : (
        <div className="container mx-auto max-w-5xl p-4 w-full relative pt-12 md:pt-16 animate-fade-in">
          {backAction && (
            <div className="absolute left-4 top-4 md:left-8 md:top-8 z-10">
              <BackButton onClick={backAction} />
            </div>
          )}
          <div className="pt-4">{renderContent()}</div>
        </div>
      )}
    </div>
  );
}
