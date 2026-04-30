import { useEffect, useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { achievementApi } from '../api/achievement';
import { playerApi } from '../api/player';
import type { AchievementVO } from '../types';

interface Props { showToast: (msg: string, type?: string) => void; }

export default function AchievementPage({ showToast }: Props) {
  const { setPlayer } = usePlayerStore();
  const [list, setList] = useState<AchievementVO[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setList((await achievementApi.getAll()).data.data); }
    catch { showToast('加载失败', 'error'); }
  };

  const claim = async (a: AchievementVO) => {
    try {
      const r = (await achievementApi.claimReward(a.id)).data.data;
      showToast(`+${r.rewardValue} ${r.rewardType === 'gold' ? '灵石' : '玉石'}`, 'success');
      await load(); setPlayer((await playerApi.getInfo()).data.data);
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  const icon = (t: string) => ({ level: '修', stage: '关', pet_collect: '宠', gold: '财' }[t] || '成');
  const done = list.filter(a => a.isCompleted).length;
  const rewarded = list.filter(a => a.isRewarded).length;

  return (
    <div className="fade-in">
      <h2 className="page-title">成就</h2>

      {/* 统计 */}
      <div style={{ display: 'flex', gap: 40, marginBottom: 32, padding: '24px 0', borderBottom: '1px solid var(--ink-whisper)' }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 200, color: 'var(--ink-deep)', letterSpacing: '2px' }}>{done}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', letterSpacing: '3px' }}>达成</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 200, color: 'var(--ink-deep)', letterSpacing: '2px' }}>{rewarded}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', letterSpacing: '3px' }}>领取</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 200, color: 'var(--ink-deep)', letterSpacing: '2px' }}>{list.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', letterSpacing: '3px' }}>总计</div>
        </div>
      </div>

      {/* 列表 */}
      <div>
        {list.map(a => (
          <div key={a.id} className={`achievement-card ${a.isCompleted ? 'completed' : ''} ${a.isRewarded ? 'rewarded' : ''}`}>
            <div style={{
              width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: a.isCompleted && !a.isRewarded ? 'var(--ink-dark)' : 'var(--ink-mist)',
              color: a.isCompleted && !a.isRewarded ? 'var(--paper)' : 'var(--ink-faint)',
              fontSize: '1.1rem', fontWeight: 600, flexShrink: 0, letterSpacing: '2px'
            }}>
              {a.isRewarded ? '✓' : icon(a.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: a.isCompleted ? 'var(--ink-deep)' : 'var(--ink-medium)', letterSpacing: '2px', marginBottom: 4, fontSize: '0.95rem' }}>
                {a.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', marginBottom: 10 }}>{a.description}</div>
              <div className="progress-bar" style={{ height: 4 }}>
                <div className="progress-fill achievement" style={{ width: `${Math.min(a.progress, 100)}%` }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--ink-ghost)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>{a.currentValue}/{a.targetValue}</span><span>{Math.round(a.progress)}%</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 100 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--ink-faint)', letterSpacing: '2px', marginBottom: 4 }}>奖励</div>
              <div style={{ color: 'var(--ink-deep)', fontWeight: 600, fontSize: '0.95rem' }}>
                {a.rewardType === 'gold' ? '灵石' : '玉石'} {a.rewardValue}
              </div>
              {a.isCompleted && !a.isRewarded && (
                <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => claim(a)}>领取</button>
              )}
              {a.isRewarded && <div style={{ fontSize: '0.7rem', color: 'var(--ink-ghost)', marginTop: 6 }}>已领</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 48, color: 'var(--ink-ghost)', fontSize: '0.8rem', letterSpacing: '4px' }}>
        道阻且长
      </div>
    </div>
  );
}
