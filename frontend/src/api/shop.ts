import api from './request';
import type { ShopItemVO, InventoryItem, Result } from '../types';

export const shopApi = {
  getItems: () => api.get<Result<ShopItemVO[]>>('/shop/items'),
  buy: (shopItemId: number, quantity = 1) =>
    api.post<Result<{ gold: number; diamond: number }>>('/shop/buy', { shopItemId, quantity }),
  sell: (inventoryId: number, quantity = 1) =>
    api.post<Result<{ gold: number; earned: number }>>('/shop/sell', null, { params: { inventoryId, quantity } }),
  getInventory: () => api.get<Result<InventoryItem[]>>('/inventory'),
  equip: (inventoryId: number) =>
    api.post<Result<any>>('/inventory/equip', null, { params: { inventoryId } }),
  unequip: (inventoryId: number) =>
    api.post<Result<any>>('/inventory/unequip', null, { params: { inventoryId } }),
};
