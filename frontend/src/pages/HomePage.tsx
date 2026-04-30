import { useEffect, useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { playerApi } from '../api/player';

interface Props {
  showToast: (msg: string, type?: string) => void;
}

export default function HomePage({ showToast }: Props) {
  const { player, setPlayer } = usePlayerStore();
  const [idleReward, setIdleReward] = useState<any>(null);
  const [collecting, setCollecting] = useState(false);

  useEffect(() => {
    if (player) checkIdleReward();
  }, []);

  const checkIdleReward = async () => {
    try {
      const res = await playerApi.collectIdleReward();
      const reward = res.data.data;
      if (reward.goldEarned > 0 || reward.expEarned > 0) setIdleReward(reward);
    } catch {}
  };

  const collectReward = async () => {
    setCollecting(true);
    try {
      const res = await playerApi.collectIdleReward();
      setIdleReward(res.data.data);
      showToast(`获得 ${res.data.data.goldEarned} 灵石, ${res.data.data.expEarned} 修为`, 'success');
      if (res.data.data.levelUp) showToast(`突破到第 ${res.data.data.newLevel} 重！`, 'success');
      setPlayer((await playerApi.getInfo()).data.data);
    } catch (err: any) {
      showToast(err.message || '领取失败', 'error');
    } finally {
      setCollecting(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setPlayer((await playerApi.upgrade()).data.data);
      showToast('境界突破！', 'success');
    } catch (err: any) {
      showToast(err.message || '突破失败', 'error');
    }
  };

  if (!player) return null;

  const expPct = player.expToNextLevel > 0 ? (player.exp / player.expToNextLevel) * 100 : 0;
  const hpPct = player.maxHp > 0 ? (player.hp / player.maxHp) * 100 : 0;

  const realm = (lv: number) => {
    if (lv <= 3) return '练气初';
    if (lv <= 5) return '练气中';
    if (lv <= 8) return '练气后';
    if (lv <= 10) return '筑基初';
    if (lv <= 15) return '筑基中';
    if (lv <= 20) return '筑基后';
    if (lv <= 25) return '金丹初';
    if (lv <= 30) return '金丹中';
    if (lv <= 35) return '金丹后';
    if (lv <= 40) return '元婴初';
    if (lv <= 45) return '元婴中';
    if (lv <= 50) return '元婴后';
    return '化神';
  };

  return (
    <div className="fade-in">
      <h2 className="page-title">仙府</h2>

      {/* 角色面板 - 云雾悬浮 */}
      <div className="card">
        <div className="flex-between mb-24">
          <div>
            <span style={{ 
              fontSize: '1.6rem', 
              color: 'var(--ink-deep)', 
              fontWeight: 900, 
              letterSpacing: '6px' 
            }}>
              {player.nickname}
            </span>
            <div style={{ 
              marginTop: 10, 
              color: 'var(--ink-light)', 
              fontSize: '0.85rem',
              letterSpacing: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ 
                padding: '4px 12px',
                background: 'var(--ink-dark)',
                color: 'var(--paper)',
                fontSize: '0.75rem',
                letterSpacing: '2px'
              }}>
                {realm(player.level)}
              </span>
              <span>第{player.level}重</span>
            </div>
          </div>
          {/* 墨块按钮 */}
          <button className="btn btn-primary btn-sm" onClick={handleUpgrade}>
            突破境界
          </button>
        </div>

        {/* 飞白进度条 - 修为 */}
        <div className="mb-24">
          <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: 8 }}>
            <span style={{ letterSpacing: '3px', color: 'var(--ink-light)' }}>修为</span>
            <span style={{ color: 'var(--ink-faint)', fontSize: '0.75rem' }}>{player.exp} / {player.expToNextLevel}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill exp" style={{ width: `${expPct}%` }} />
          </div>
        </div>

        {/* 飞白进度条 - 气血 */}
        <div className="mb-24">
          <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: 8 }}>
            <span style={{ letterSpacing: '3px', color: 'var(--ink-light)' }}>气血</span>
            <span style={{ color: 'var(--ink-faint)', fontSize: '0.75rem' }}>{player.hp} / {player.maxHp}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill hp" style={{ width: `${hpPct}%` }} />
          </div>
        </div>

        {/* 属性 - 极简数字 */}
        <div className="grid-3" style={{ 
          padding: '20px 0',
          borderTop: '1px solid var(--ink-whisper)'
        }}>
          <div className="text-center">
            <div style={{ color: 'var(--ink-faint)', fontSize: '0.7rem', marginBottom: 6, letterSpacing: '3px' }}>攻击</div>
            <div style={{ color: 'var(--ink-deep)', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '2px' }}>
              {player.attack}
            </div>
          </div>
          <div className="text-center" style={{ borderLeft: '1px solid var(--ink-whisper)', borderRight: '1px solid var(--ink-whisper)' }}>
            <div style={{ color: 'var(--ink-faint)', fontSize: '0.7rem', marginBottom: 6, letterSpacing: '3px' }}>防御</div>
            <div style={{ color: 'var(--ink-deep)', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '2px' }}>
              {player.defense}
            </div>
          </div>
          <div className="text-center">
            <div style={{ color: 'var(--ink-faint)', fontSize: '0.7rem', marginBottom: 6, letterSpacing: '3px' }}>气血</div>
            <div style={{ color: 'var(--ink-deep)', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '2px' }}>
              {player.maxHp}
            </div>
          </div>
        </div>
      </div>

      {/* 放置修炼面板 */}
      <div className="card">
        <div className="card-title">放置修炼</div>
        
        <div className="grid-2 mb-24">
          <div style={{ 
            padding: '20px 0',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--ink-faint)', fontSize: '0.7rem', marginBottom: 8, letterSpacing: '3px' }}>每秒修为</div>
            <div style={{ color: 'var(--ink-deep)', fontSize: '1.8rem', fontWeight: 200, letterSpacing: '2px' }}>
              {player.idleExpRate.toFixed(1)}
            </div>
          </div>
          <div style={{ 
            padding: '20px 0',
            textAlign: 'center',
            borderLeft: '1px solid var(--ink-whisper)'
          }}>
            <div style={{ color: 'var(--ink-faint)', fontSize: '0.7rem', marginBottom: 8, letterSpacing: '3px' }}>每秒灵石</div>
            <div style={{ color: 'var(--ink-deep)', fontSize: '1.8rem', fontWeight: 200, letterSpacing: '2px' }}>
              {player.idleGoldRate.toFixed(1)}
            </div>
          </div>
        </div>

        {/* 离线收益 - 淡墨边 */}
        {idleReward && (
          <div style={{ 
            padding: '20px 24px',
            borderTop: '1px solid var(--ink-whisper)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', marginBottom: 10, letterSpacing: '2px' }}>
                离线 {Math.floor(idleReward.offlineSeconds / 60)} 分钟
              </div>
              <div style={{ display: 'flex', gap: '28px' }}>
                <span style={{ color: 'var(--ink-faint)', fontSize: '0.8rem' }}>
                  灵石 <span style={{ color: 'var(--ink-deep)', fontWeight: 600, fontSize: '1.1rem' }}>+{idleReward.goldEarned}</span>
                </span>
                <span style={{ color: 'var(--ink-faint)', fontSize: '0.8rem' }}>
                  修为 <span style={{ color: 'var(--ink-deep)', fontWeight: 600, fontSize: '1.1rem' }}>+{idleReward.expEarned}</span>
                </span>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={collectReward} disabled={collecting}>
              {collecting ? '...' : '收取'}
            </button>
          </div>
        )}
      </div>

      {/* 修仙之路 */}
      <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ 
          fontSize: '2.4rem', 
          fontWeight: 200, 
          color: 'var(--ink-deep)',
          letterSpacing: '16px',
          marginBottom: '16px'
        }}>
          {realm(player.level)}
        </div>
        <div style={{ 
          color: 'var(--ink-faint)', 
          fontSize: '0.85rem', 
          letterSpacing: '4px',
          marginBottom: '32px'
        }}>
          {player.level <= 5 && '初入修仙之路'}
          {player.level > 5 && player.level <= 10 && '根基渐稳'}
          {player.level > 10 && player.level <= 20 && '金丹初现'}
          {player.level > 20 && player.level <= 35 && '元婴初现'}
          {player.level > 35 && player.level <= 50 && '化神通灵'}
          {player.level > 50 && '大乘之境'}
        </div>
        
        {/* 境界点 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {[1, 10, 20, 30, 40, 50].map((lv) => (
            <div 
              key={lv}
              style={{
                width: player.level >= lv ? '8px' : '6px',
                height: player.level >= lv ? '8px' : '6px',
                background: player.level >= lv ? 'var(--ink-dark)' : 'var(--ink-whisper)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
