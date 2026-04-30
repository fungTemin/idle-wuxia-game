package com.idlewuxia.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.idlewuxia.entity.Item;
import com.idlewuxia.entity.Player;
import com.idlewuxia.entity.PlayerInventory;
import com.idlewuxia.mapper.ItemMapper;
import com.idlewuxia.mapper.PlayerInventoryMapper;
import com.idlewuxia.mapper.PlayerMapper;
import com.idlewuxia.service.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final PlayerInventoryMapper inventoryMapper;
    private final ItemMapper itemMapper;
    private final PlayerMapper playerMapper;

    public InventoryServiceImpl(PlayerInventoryMapper inventoryMapper, ItemMapper itemMapper,
                                PlayerMapper playerMapper) {
        this.inventoryMapper = inventoryMapper;
        this.itemMapper = itemMapper;
        this.playerMapper = playerMapper;
    }

    @Override
    public List<Map<String, Object>> getInventory(Long playerId) {
        LambdaQueryWrapper<PlayerInventory> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerInventory::getPlayerId, playerId).orderByDesc(PlayerInventory::getIsEquipped);
        List<PlayerInventory> items = inventoryMapper.selectList(qw);

        return items.stream().map(inv -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", inv.getId());
            map.put("itemId", inv.getItemId());
            map.put("quantity", inv.getQuantity());
            map.put("isEquipped", inv.getIsEquipped());
            map.put("equippedSlot", inv.getEquippedSlot());
            Item item = itemMapper.selectById(inv.getItemId());
            if (item != null) {
                map.put("name", item.getName());
                map.put("description", item.getDescription());
                map.put("type", item.getType());
                map.put("rarity", item.getRarity());
                map.put("attackBonus", item.getAttackBonus());
                map.put("defenseBonus", item.getDefenseBonus());
                map.put("hpBonus", item.getHpBonus());
            }
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> equip(Long playerId, Integer inventoryId) {
        PlayerInventory inv = getAndVerify(playerId, inventoryId);
        Item item = itemMapper.selectById(inv.getItemId());
        if (item == null) throw new RuntimeException("物品不存在");

        String slot = item.getType();
        if (!"weapon".equals(slot) && !"armor".equals(slot) && !"accessory".equals(slot)) {
            throw new RuntimeException("该物品不可装备");
        }

        // Unequip current item in same slot
        LambdaQueryWrapper<PlayerInventory> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerInventory::getPlayerId, playerId)
          .eq(PlayerInventory::getIsEquipped, true)
          .eq(PlayerInventory::getEquippedSlot, slot);
        PlayerInventory current = inventoryMapper.selectOne(qw);
        if (current != null) {
            unequipItem(playerId, current);
        }

        inv.setIsEquipped(true);
        inv.setEquippedSlot(slot);
        inventoryMapper.updateById(inv);

        applyEquipmentStats(playerId);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> unequip(Long playerId, Integer inventoryId) {
        PlayerInventory inv = getAndVerify(playerId, inventoryId);
        if (!inv.getIsEquipped()) throw new RuntimeException("该物品未装备");

        unequipItem(playerId, inv);
        applyEquipmentStats(playerId);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        return result;
    }

    private void unequipItem(Long playerId, PlayerInventory inv) {
        inv.setIsEquipped(false);
        inv.setEquippedSlot(null);
        inventoryMapper.updateById(inv);
    }

    private void applyEquipmentStats(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) return;

        // Reset to base stats (level-based)
        int baseAttack = 10 + (player.getLevel() - 1) * 3;
        int baseDefense = 5 + (player.getLevel() - 1) * 2;
        int baseMaxHp = 100 + (player.getLevel() - 1) * 20;

        LambdaQueryWrapper<PlayerInventory> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerInventory::getPlayerId, playerId).eq(PlayerInventory::getIsEquipped, true);
        List<PlayerInventory> equipped = inventoryMapper.selectList(qw);

        for (PlayerInventory inv : equipped) {
            Item item = itemMapper.selectById(inv.getItemId());
            if (item != null) {
                baseAttack += item.getAttackBonus();
                baseDefense += item.getDefenseBonus();
                baseMaxHp += item.getHpBonus();
            }
        }

        player.setAttack(baseAttack);
        player.setDefense(baseDefense);
        player.setMaxHp(baseMaxHp);
        if (player.getHp() > baseMaxHp) player.setHp(baseMaxHp);
        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);
    }

    private PlayerInventory getAndVerify(Long playerId, Integer inventoryId) {
        PlayerInventory inv = inventoryMapper.selectById(inventoryId);
        if (inv == null || !inv.getPlayerId().equals(playerId)) {
            throw new RuntimeException("物品不存在");
        }
        return inv;
    }
}
