import type { ReactNode } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';

interface Props {
  children: ReactNode;
}

const tabs = [
  { key: 'home', label: '仙府' },
  { key: 'battle', label: '闯关' },
  { key: 'pet', label: '灵宠' },
  { key: 'shop', label: '商铺' },
  { key: 'achievement', label: '成就' },
];

/* 白描图标 - 灵石 */
const StoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L16 6V14L10 18L4 14V6L10 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M10 2L16 6M10 2L4 6M10 18V2M10 18L16 14M10 18L4 14M4 6L16 6M4 14L16 14" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

/* 白描图标 - 玉石 */
const JadeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
    <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.3"/>
    <path d="M10 3V5M10 15V17M3 10H5M15 10H17" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
  </svg>
);

/* 白描图标 - 境界 */
const RealmIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L13 8H18L14 12L15.5 18L10 14.5L4.5 18L6 12L2 8H7L10 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

/* 竹节装饰 */
const BambooDivider = ({ vertical = false }: { vertical?: boolean }) => {
  if (vertical) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        opacity: 0.25,
        height: '28px'
      }}>
        <div style={{ width: '2px', height: '10px', background: 'var(--ink-medium)', borderRadius: '1px' }} />
        <div style={{ width: '5px', height: '1.5px', background: 'var(--ink-dark)', borderRadius: '1px' }} />
        <div style={{ width: '2px', height: '10px', background: 'var(--ink-medium)', borderRadius: '1px' }} />
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      opacity: 0.2
    }}>
      <div style={{ height: '2px', width: '12px', background: 'var(--ink-medium)', borderRadius: '1px' }} />
      <div style={{ height: '5px', width: '1.5px', background: 'var(--ink-dark)', borderRadius: '1px' }} />
      <div style={{ height: '2px', width: '12px', background: 'var(--ink-medium)', borderRadius: '1px' }} />
    </div>
  );
};

export default function GameLayout({ children }: Props) {
  const { player, logout } = usePlayerStore();
  const { activeTab, setActiveTab } = useGameStore();

  if (!player) return null;

  return (
    <div className="game-layout fade-in">
      {/* 顶部 - 极简 */}
      <header className="header">
        <div className="header-content">
          {/* 标题 - 竹节装饰 */}
          <div className="game-title bamboo-animate">
            <div className="bamboo-left">
              <div className="bamboo-segment" />
              <div className="bamboo-node" />
              <div className="bamboo-segment" />
            </div>
            仙侠放置录
            <div className="bamboo-right">
              <div className="bamboo-segment" />
              <div className="bamboo-node" />
              <div className="bamboo-segment" />
            </div>
          </div>
          
          {/* 资源栏 - 白描图标 */}
          <div className="resource-bar">
            <div className="resource-item">
              <StoneIcon />
              <span className="resource-value">{player.gold.toLocaleString()}</span>
            </div>
            <div className="resource-item">
              <JadeIcon />
              <span className="resource-value">{player.diamond}</span>
            </div>
            <div className="resource-item">
              <RealmIcon />
              <span className="resource-value">第{player.level}重</span>
            </div>
            <BambooDivider vertical />
            <button className="btn btn-secondary btn-sm btn-click" onClick={logout}>
              归隐
            </button>
          </div>
        </div>
      </header>

      {/* 导航 - 宣纸上直接排列 */}
      <nav className="nav-bar">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </nav>

      {/* 主内容 */}
      <main className="main-content">
        {children}
      </main>

      {/* 底部 */}
      <footer style={{
        textAlign: 'center',
        padding: '32px 40px',
        color: 'var(--ink-ghost)',
        fontSize: '0.75rem',
        letterSpacing: '4px',
        position: 'relative'
      }}>
        <BambooDivider />
        <div style={{ marginTop: '12px' }}>
          笔墨纸砚 · 仙侠放置录
        </div>
      </footer>
    </div>
  );
}
