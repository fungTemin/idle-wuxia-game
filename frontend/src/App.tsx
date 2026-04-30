import { useEffect, useState } from 'react';
import { usePlayerStore } from './stores/playerStore';
import LoginPage from './pages/LoginPage';
import GameLayout from './components/layout/GameLayout';
import HomePage from './pages/HomePage';
import BattlePage from './pages/BattlePage';
import PetPage from './pages/PetPage';
import ShopPage from './pages/ShopPage';
import AchievementPage from './pages/AchievementPage';
import { useGameStore } from './stores/gameStore';
import './App.css';

function App() {
  const { player, token, init } = usePlayerStore();
  const { activeTab } = useGameStore();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  if (!token || !player) {
    return <LoginPage />;
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
        {renderPage()}
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
