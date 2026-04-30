import { lazy, Suspense, useEffect, useState } from 'react';
import { usePlayerStore } from './stores/playerStore';
import GameLayout from './components/layout/GameLayout';
import { useGameStore } from './stores/gameStore';
import './App.css';

// 懒加载页面组件
const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const BattlePage = lazy(() => import('./pages/BattlePage'));
const PetPage = lazy(() => import('./pages/PetPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const AchievementPage = lazy(() => import('./pages/AchievementPage'));

// 加载组件
const PageLoading = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '50vh',
    color: 'var(--ink-faint)',
    letterSpacing: '4px'
  }}>
    <div className="loading-dots">
      <span/><span/><span/>
    </div>
  </div>
);

function App() {
  const { player, token, init } = usePlayerStore();
  const { activeTab } = useGameStore();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  if (!token || !player) {
    return (
      <Suspense fallback={<PageLoading />}>
        <LoginPage />
      </Suspense>
    );
  }

  const showToast = (message: string, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage showToast={showToast} />;
      case 'battle': return <BattlePage showToast={showToast} />;
      case 'pet': return <PetPage showToast={showToast} />;
      case 'shop': return <ShopPage showToast={showToast} />;
      case 'achievement': return <AchievementPage showToast={showToast} />;
      default: return <HomePage showToast={showToast} />;
    }
  };

  return (
    <>
      <GameLayout>
        <Suspense fallback={<PageLoading />}>
          {renderPage()}
        </Suspense>
      </GameLayout>
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}

export default App;
