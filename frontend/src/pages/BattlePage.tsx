import { useEffect, useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { battleApi } from '../api/battle';
import { playerApi } from '../api/player';
import type { Stage, BattleResult } from '../types';

interface Props { showToast: (msg: string, type?: string) => void; }

export default function BattlePage({ showToast }: Props) {
  const { player, setPlayer } = usePlayerStore();
  const [stages, setStages] = useState<Stage[]>([]);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [battling, setBattling] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => { loadStages(); }, []);

  const loadStages = async () => {
    try { setStages((await battleApi.getStages()).data.data); }
    catch { showToast('加载失败', 'error'); }
  };

  const startBattle = async () => {
    setBattling(true);
    try {
      const res = (await battleApi.startBattle()).data.data;
      setBattleResult(res); setShowResult(true);
      if (res.victory) {
        showToast(`战胜${res.monsterName}！+${res.goldReward}灵石`, 'success');
        if (res.levelUp) showToast(`突破到第${res.newLevel}重！`, 'success');
      }
      setPlayer((await playerApi.getInfo()).data.data);
      loadStages();
    } catch (err: any) { showToast(err.message, 'error'); }
    finally { setBattling(false); }
  };

  const quickBattle = async () => {
    setBattling(true);
    try {
      const res = (await battleApi.quickBattle()).data.data;
      setBattleResult(res); setShowResult(true);
      showToast(`扫荡+${res.goldReward}灵石`, 'success');
      setPlayer((await playerApi.getInfo()).data.data);
    } catch (err: any) { showToast(err.message, 'error'); }
    finally { setBattling(false); }
  };

  const cur = stages.find(s => s.current);

  return (
    <div className="fade-in">
      <h2 className="page-title">闯关</h2>

      <div className="card">
        <div className="flex-between mb-24">
          <div style={{ flex: 1 }}>
            <div className="card-title">当前关卡</div>
            {cur ? (
              <>
                <div style={{ fontSize: '1.4rem', color: 'var(--ink-deep)', fontWeight: 900, letterSpacing: '6px', marginBottom: 8 }}>
                  {cur.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginBottom: 16, fontStyle: 'italic', letterSpacing: '2px' }}>
                  「{cur.description}」
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: 'var(--ink-light)', letterSpacing: '1px' }}>
                  <span>{cur.monsterName}</span>
                  <span>攻 {cur.monsterAttack}</span>
                  <span>血 {cur.monsterHp}</span>
                </div>
              </>
            ) : <div style={{ color: 'var(--ink-faint)' }}>暂无</div>}
          </div>
          {cur && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--ink-faint)', letterSpacing: '2px', marginBottom: 8 }}>奖励</div>
              <div style={{ color: 'var(--ink-deep)', fontWeight: 600, fontSize: '1.2rem' }}>{cur.goldReward} 灵石</div>
              <div style={{ color: 'var(--ink-light)', fontSize: '0.85rem', marginTop: 4 }}>{cur.expReward} 修为</div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary btn-click" onClick={startBattle} disabled={battling || !cur} style={{ flex: 1 }}>
            {battling ? <span className="loading-dots"><span/><span/><span/></span> : '挑战'}
          </button>
          <button className="btn btn-secondary btn-click" onClick={quickBattle} disabled={battling || (player?.currentStageId || 1) <= 1} style={{ flex: 1 }}>
            扫荡
          </button>
        </div>
      </div>

      {/* 结果 */}
      {showResult && battleResult && (
        <div className="modal-overlay" onClick={() => setShowResult(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={battleResult.victory ? 'victory-glow' : 'battle-shake'} style={{ textAlign: 'center', marginBottom: 24, padding: '16px 0' }}>
              <div className="stamp-animate" style={{ fontSize: '1.8rem', color: battleResult.victory ? 'var(--ink-deep)' : 'var(--cinnabar)', fontWeight: 200, letterSpacing: '10px' }}>
                {battleResult.victory ? '胜' : '败'}
              </div>
              <div style={{ width: 30, height: 2, background: battleResult.victory ? 'var(--ink-dark)' : 'var(--cinnabar)', margin: '12px auto' }} />
            </div>
            <div className="battle-log">
              {battleResult.battleLog.map((l, i) => <p key={i}>{l}</p>)}
            </div>
            {battleResult.victory && (
              <div style={{ marginTop: 20, padding: '16px 0', borderTop: '1px solid var(--ink-whisper)' }}>
                <div className="grid-2" style={{ gap: 12, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-faint)', letterSpacing: '2px' }}>灵石</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--ink-deep)' }}>+{battleResult.goldReward}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-faint)', letterSpacing: '2px' }}>修为</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--ink-deep)' }}>+{battleResult.expReward}</div>
                  </div>
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button className="btn btn-primary btn-click" onClick={() => setShowResult(false)}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 关卡列表 */}
      <div className="card mt-24">
        <div className="card-title">关卡</div>
        <div className="stage-grid stagger-in">
          {stages.map(s => (
            <div key={s.id} className={`stage-card ${!s.unlocked ? 'locked' : ''} ${s.current ? 'current' : ''}`}>
              <div className="flex-between mb-8">
                <span style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', letterSpacing: '1px' }}>
                  {s.chapter}-{s.stageOrder}
                </span>
                {s.current && <span className="badge badge-ssr">当前</span>}
                {!s.unlocked && <span style={{ fontSize: '0.75rem', color: 'var(--ink-ghost)' }}>🔒</span>}
              </div>
              <div style={{ fontWeight: 600, color: s.unlocked ? 'var(--ink-deep)' : 'var(--ink-ghost)', letterSpacing: '2px', fontSize: '0.95rem' }}>
                {s.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', marginTop: 4 }}>{s.monsterName}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--ink-ghost)', marginTop: 8, letterSpacing: '1px' }}>
                第{s.requiredLevel}重
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
