import { useEffect, useState } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { shopApi } from '../api/shop';
import { playerApi } from '../api/player';
import type { ShopItemVO, InventoryItem } from '../types';

interface Props { showToast: (msg: string, type?: string) => void; }

export default function ShopPage({ showToast }: Props) {
  const { player, setPlayer } = usePlayerStore();
  const [items, setItems] = useState<ShopItemVO[]>([]);
  const [inv, setInv] = useState<InventoryItem[]>([]);
  const [tab, setTab] = useState<'shop' | 'bag'>('shop');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [s, i] = await Promise.all([shopApi.getItems(), shopApi.getInventory()]);
      setItems(s.data.data); setInv(i.data.data);
    } catch { showToast('加载失败', 'error'); }
  };

  const refresh = async () => setPlayer((await playerApi.getInfo()).data.data);

  const rarityName = (r: string) => ({ N: '凡品', R: '灵品', SR: '仙品', SSR: '神品' }[r] || r);

  const buy = async (item: ShopItemVO) => {
    try { await shopApi.buy(item.id); showToast(`${item.name}`, 'success'); await loadData(); await refresh(); }
    catch (err: any) { showToast(err.message, 'error'); }
  };

  const sell = async (item: InventoryItem) => {
    try { const r = await shopApi.sell(item.id); showToast(`+${r.data.data.earned}灵石`, 'success'); await loadData(); await refresh(); }
    catch (err: any) { showToast(err.message, 'error'); }
  };

  const equip = async (item: InventoryItem) => {
    try { await shopApi.equip(item.id); showToast('装备', 'success'); await loadData(); await refresh(); }
    catch (err: any) { showToast(err.message, 'error'); }
  };

  const unequip = async (item: InventoryItem) => {
    try { await shopApi.unequip(item.id); showToast('卸下', 'success'); await loadData(); await refresh(); }
    catch (err: any) { showToast(err.message, 'error'); }
  };

  return (
    <div className="fade-in">
      <h2 className="page-title">商铺</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <button className={`btn ${tab === 'shop' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setTab('shop')}>货架</button>
        <button className={`btn ${tab === 'bag' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setTab('bag')}>行囊 ({inv.length})</button>
      </div>

      {tab === 'shop' ? (
        <div className="grid-3">
          {items.map(item => (
            <div key={item.id} className="card">
              <div className="flex-between mb-16">
                <span style={{ fontWeight: 600, letterSpacing: '2px', fontSize: '0.95rem' }}>{item.name}</span>
                <span className={`badge badge-${(item.rarity || 'n').toLowerCase()}`}>{rarityName(item.rarity)}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: 14, fontStyle: 'italic' }}>
                「{item.description}」
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', marginBottom: 14 }}>
                {item.attackBonus > 0 && <span>攻+{item.attackBonus} </span>}
                {item.defenseBonus > 0 && <span>防+{item.defenseBonus} </span>}
                {item.hpBonus > 0 && <span>血+{item.hpBonus}</span>}
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--ink-deep)', fontWeight: 600, fontSize: '1rem' }}>{item.price} {item.priceType === 'gold' ? '灵石' : '玉石'}</span>
                <button className="btn btn-primary btn-sm" onClick={() => buy(item)}
                  disabled={(item.priceType === 'gold' && (player?.gold || 0) < item.price) || (item.priceType === 'diamond' && (player?.diamond || 0) < item.price)}>
                  购买
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        inv.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '2rem', opacity: 0.15, marginBottom: 16 }}>空</div>
            <div style={{ letterSpacing: '3px' }}>行囊空空</div>
          </div>
        ) : (
          <div className="grid-3">
            {inv.map(item => (
              <div key={item.id} className="card" style={{ borderBottom: item.isEquipped ? '2px solid var(--ink-dark)' : undefined }}>
                <div className="flex-between mb-16">
                  <span style={{ fontWeight: 600, letterSpacing: '2px' }}>{item.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ink-faint)' }}>×{item.quantity}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', marginBottom: 12 }}>
                  {item.attackBonus > 0 && <span>攻+{item.attackBonus} </span>}
                  {item.defenseBonus > 0 && <span>防+{item.defenseBonus} </span>}
                  {item.hpBonus > 0 && <span>血+{item.hpBonus}</span>}
                </div>
                {item.isEquipped && <div style={{ fontSize: '0.75rem', color: 'var(--paper)', background: 'var(--ink-dark)', textAlign: 'center', padding: '6px', marginBottom: 12, letterSpacing: '2px' }}>已装备</div>}
                <div style={{ display: 'flex', gap: 8 }}>
                  {item.type !== 'material' && (
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => item.isEquipped ? unequip(item) : equip(item)}>
                      {item.isEquipped ? '卸下' : '装备'}
                    </button>
                  )}
                  <button className="btn btn-sm" style={{ flex: 1, color: 'var(--cinnabar)' }} onClick={() => sell(item)}>出售</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
