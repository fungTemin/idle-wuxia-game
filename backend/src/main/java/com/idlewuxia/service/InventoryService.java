package com.idlewuxia.service;

import java.util.List;
import java.util.Map;

public interface InventoryService {
    List<Map<String, Object>> getInventory(Long playerId);
    Map<String, Object> equip(Long playerId, Integer inventoryId);
    Map<String, Object> unequip(Long playerId, Integer inventoryId);
}
