import { useEffect, useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { petApi } from '../api/pet';
import { playerApi } from '../api/player';
import type { PetVO } from '../types';

interface Props { showToast: (msg: string, type?: string) => void; }

export default function PetPage({ showToast }: Props) {
  const { player, setPlayer } = usePlayerStore();
  const [pets, setPets] = useState<PetVO[]>([]);
  const [collection, setCollection] = useState<any[]>([]);
  const [summoning, setSummoning] = useState(false);
  const [showSummon, setShowSummon] = useState<PetVO | null>(null);
  const [selected, setSelected] = useState<PetVO | null>(null);
  const [tab, setTab] = useState<'pets' | 'collection'>('pets');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([petApi.getAll(), petApi.getCollection()]);
      setPets(p.data.data); setCollection(c.data.data);
    } catch { showToast('加载失败', 'error'); }
  };

  const refresh = async () => setPlayer((await playerApi.getInfo()).data.data);

  const summon = async () => {
    setSummoning(true);
    try {
      const { pet } = (await petApi.summon()).data.data;
      setShowSummon(pet); showToast(`${pet.name}！`, 'success');
      await loadData(); await refresh();
    } catch (err: any) { showToast(err.message, 'error'); }
    finally { setSummoning(false); }
  };

  const upgrade = async (p: PetVO) => {
    try { setSelected((await petApi.upgrade(p.id)).data.data); showToast('提升成功', 'success'); await loadData(); await refresh(); }
    catch (err: any) { showToast(err.message, 'error'); }
  };

  const evolve = async (p: PetVO) => {
    try { setSelected((await petApi.evolve(p.id)).data.data); showToast('进化成功', 'success'); await loadData(); }
    catch (err: any) { showToast(err.message, 'error'); }
  };

  const skill = async (p: PetVO) => {
    try { setSelected((await petApi.upgradeSkill(p.id)).data.data); showToast('灵技提升', 'success'); await loadData(); await refresh(); }
    catch (err: any) { showToast(err.message, 'error'); }
  };

  const toggle = async (p: PetVO) => {
    try { setSelected((await petApi.toggleActive(p.id)).data.data); showToast(p.isActive ? '归巢' : '出战', 'success'); await loadData(); }
    catch (err: any) { showToast(err.message, 'error'); }
  };

  const rarityName = (r: string) => ({ N: '凡品', R: '灵品', SR: '仙品', SSR: '神品' }[r] || r);
  const owned = collection.filter(c => c.owned).length;

  return (
    <div className="fade-in">
      <h2 className="page-title">灵宠</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center' }}>
        <button className={`btn ${tab === 'pets' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setTab('pets')}>
          灵宠 ({pets.length})
        </button>
        <button className={`btn ${tab === 'collection' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setTab('collection')}>
          图鉴 ({owned}/{collection.length})
        </button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm" onClick={summon} disabled={summoning || (player?.diamond || 0) < 200}>
          {summoning ? '...' : '召唤 (200玉石)'}
        </button>
      </div>

      {tab === 'pets' ? (
        pets.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '2rem', opacity: 0.15, marginBottom: 16 }}>🐾</div>
            <div style={{ letterSpacing: '3px', fontSize: '0.95rem' }}>尚未收服灵宠</div>
          </div>
        ) : (
          <div className="grid-3">
            {pets.map(pet => (
              <div key={pet.id} className={`pet-card ${pet.isActive ? 'active' : ''}`} onClick={() => setSelected(pet)} style={{ cursor: 'pointer' }}>
                <div className="flex-between mb-16">
                  <span style={{ fontWeight: 700, letterSpacing: '3px', fontSize: '1rem' }}>{pet.name}</span>
                  <span className={`badge badge-${pet.rarity.toLowerCase()}`}>{rarityName(pet.rarity)}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: 14, fontStyle: 'italic', letterSpacing: '1px' }}>
                  「{pet.description}」
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--ink-faint)', marginBottom: 10 }}>
                  <span>攻 {pet.attack}</span><span>防 {pet.defense}</span><span>血 {pet.hp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ink-faint)' }}>
                  <span>第{pet.level}重</span><span>{pet.skillName} {pet.skillLevel}层</span>
                </div>
                {pet.isActive && (
                  <div style={{ marginTop: 10, padding: '6px 0', background: 'var(--ink-dark)', color: 'var(--paper)', textAlign: 'center', fontSize: '0.75rem', letterSpacing: '3px' }}>
                    出战
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="grid-4">
          {collection.map(c => (
            <div key={c.id} style={{ opacity: c.owned ? 1 : 0.2, textAlign: 'center', padding: '20px 0', borderBottom: '1px solid var(--ink-whisper)' }}>
              <div style={{ fontWeight: 600, letterSpacing: '2px', marginBottom: 8, fontSize: '0.9rem' }}>
                {c.owned ? c.name : '？？？'}
              </div>
              <span className={`badge badge-${c.rarity.toLowerCase()}`}>{rarityName(c.rarity)}</span>
            </div>
          ))}
        </div>
      )}

      {/* 详情 */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-24">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '4px' }}>{selected.name}</span>
                <span className={`badge badge-${selected.rarity.toLowerCase()}`}>{rarityName(selected.rarity)}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>×</button>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginBottom: 20, fontStyle: 'italic', letterSpacing: '1px' }}>
              「{selected.description}」
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '16px 0', borderTop: '1px solid var(--ink-whisper)', borderBottom: '1px solid var(--ink-whisper)', marginBottom: 16, textAlign: 'center' }}>
              <div><div style={{ fontSize: '0.7rem', color: 'var(--ink-faint)', marginBottom: 4 }}>境界</div><div style={{ fontSize: '1.2rem', fontWeight: 600 }}>第{selected.level}重</div></div>
              <div><div style={{ fontSize: '0.7rem', color: 'var(--ink-faint)', marginBottom: 4 }}>攻击</div><div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{selected.attack}</div></div>
              <div><div style={{ fontSize: '0.7rem', color: 'var(--ink-faint)', marginBottom: 4 }}>防御</div><div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{selected.defense}</div></div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: 20 }}>
              {selected.skillName} · {selected.skillDesc}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => upgrade(selected)}>提升 ({selected.level * 50}灵石)</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => skill(selected)}>灵技 ({selected.skillLevel * 100}灵石)</button>
              </div>
              {selected.evolutionTo && (
                <button className="btn btn-primary btn-click" onClick={() => evolve(selected)} disabled={selected.level < 10}>
                  进化 {selected.level < 10 ? '(需第10重)' : ''}
                </button>
              )}
              <button className={`btn ${selected.isActive ? 'btn-cinnabar' : 'btn-secondary'}`} onClick={() => toggle(selected)}>
                {selected.isActive ? '归巢' : '出战'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 召唤结果 */}
      {showSummon && (
        <div className="modal-overlay" onClick={() => setShowSummon(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', color: 'var(--ink-faint)', letterSpacing: '6px', marginBottom: 8 }}>灵兽降临</div>
            <div style={{ width: 30, height: 2, background: 'var(--ink-dark)', margin: '0 auto 24px' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '8px', marginBottom: 12 }}>{showSummon.name}</div>
            <div className={`badge badge-${showSummon.rarity.toLowerCase()}`} style={{ marginBottom: 16 }}>{rarityName(showSummon.rarity)}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginBottom: 24, fontStyle: 'italic' }}>「{showSummon.description}」</div>
            <button className="btn btn-primary btn-click" onClick={() => setShowSummon(null)}>收下</button>
          </div>
        </div>
      )}
    </div>
  );
}
