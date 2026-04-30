package com.idlewuxia.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.idlewuxia.dto.BuyDTO;
import com.idlewuxia.entity.*;
import com.idlewuxia.mapper.*;
import com.idlewuxia.service.ShopService;
import com.idlewuxia.vo.ShopItemVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ShopServiceImpl implements ShopService {

    private final ShopItemMapper shopItemMapper;
    private final ItemMapper itemMapper;
    private final PetTemplateMapper petTemplateMapper;
    private final PlayerMapper playerMapper;
    private final PlayerInventoryMapper inventoryMapper;
    private final PlayerPetMapper playerPetMapper;

    public ShopServiceImpl(ShopItemMapper shopItemMapper, ItemMapper itemMapper,
                           PetTemplateMapper petTemplateMapper, PlayerMapper playerMapper,
                           PlayerInventoryMapper inventoryMapper, PlayerPetMapper playerPetMapper) {
        this.shopItemMapper = shopItemMapper;
        this.itemMapper = itemMapper;
        this.petTemplateMapper = petTemplateMapper;
        this.playerMapper = playerMapper;
        this.inventoryMapper = inventoryMapper;
        this.playerPetMapper = playerPetMapper;
    }

    @Override
    public List<ShopItemVO> getShopItems(Long playerId) {
        LambdaQueryWrapper<ShopItem> qw = new LambdaQueryWrapper<>();
        qw.eq(ShopItem::getIsActive, true);
        List<ShopItem> shopItems = shopItemMapper.selectList(qw);

        return shopItems.stream().map(si -> {
            ShopItemVO vo = new ShopItemVO();
            vo.setId(si.getId());
            vo.setPriceType(si.getPriceType());
            vo.setPrice(si.getPrice());
            vo.setStock(si.getStock());

            if (si.getItemId() != null) {
                Item item = itemMapper.selectById(si.getItemId());
                if (item != null) {
                    vo.setName(item.getName());
                    vo.setDescription(item.getDescription());
                    vo.setType(item.getType());
                    vo.setRarity(item.getRarity());
                    vo.setAttackBonus(item.getAttackBonus());
                    vo.setDefenseBonus(item.getDefenseBonus());
                    vo.setHpBonus(item.getHpBonus());
                    vo.setIsPet(false);
                }
            } else if (si.getPetTemplateId() != null) {
                PetTemplate pet = petTemplateMapper.selectById(si.getPetTemplateId());
                if (pet != null) {
                    vo.setName(pet.getName());
                    vo.setDescription(pet.getDescription());
                    vo.setType("pet");
                    vo.setRarity(pet.getRarity());
                    vo.setIsPet(true);
                    vo.setPetTemplateId(pet.getId());
                }
            }
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> buy(Long playerId, BuyDTO dto) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) throw new RuntimeException("玩家不存在");

        ShopItem shopItem = shopItemMapper.selectById(dto.getShopItemId());
        if (shopItem == null || !shopItem.getIsActive()) throw new RuntimeException("商品不存在");

        int totalCost = shopItem.getPrice() * dto.getQuantity();

        if ("gold".equals(shopItem.getPriceType())) {
            if (player.getGold() < totalCost) throw new RuntimeException("金币不足");
            player.setGold(player.getGold() - totalCost);
        } else if ("diamond".equals(shopItem.getPriceType())) {
            if (player.getDiamond() < totalCost) throw new RuntimeException("钻石不足");
            player.setDiamond(player.getDiamond() - totalCost);
        }

        if (shopItem.getStock() > 0) {
            shopItem.setStock(shopItem.getStock() - dto.getQuantity());
            shopItemMapper.updateById(shopItem);
        }

        if (shopItem.getItemId() != null) {
            addToInventory(playerId, shopItem.getItemId(), dto.getQuantity());
        } else if (shopItem.getPetTemplateId() != null) {
            PlayerPet pet = new PlayerPet();
            pet.setPlayerId(playerId);
            pet.setPetTemplateId(shopItem.getPetTemplateId());
            PetTemplate template = petTemplateMapper.selectById(shopItem.getPetTemplateId());
            pet.setLevel(1);
            pet.setExp(0L);
            pet.setAttack(template.getBaseAttack());
            pet.setDefense(template.getBaseDefense());
            pet.setHp(template.getBaseHp());
            pet.setSkillLevel(1);
            pet.setIsActive(false);
            pet.setSlotPosition(0);
            pet.setCreatedAt(LocalDateTime.now());
            playerPetMapper.insert(pet);
        }

        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);

        Map<String, Object> result = new HashMap<>();
        result.put("gold", player.getGold());
        result.put("diamond", player.getDiamond());
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> sell(Long playerId, Integer inventoryId, Integer quantity) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) throw new RuntimeException("玩家不存在");

        PlayerInventory inv = inventoryMapper.selectById(inventoryId);
        if (inv == null || !inv.getPlayerId().equals(playerId)) throw new RuntimeException("物品不存在");
        if (inv.getIsEquipped()) throw new RuntimeException("请先卸下装备");
        if (inv.getQuantity() < quantity) throw new RuntimeException("物品数量不足");

        Item item = itemMapper.selectById(inv.getItemId());
        int totalGold = (item != null ? item.getSellPrice() : 1) * quantity;

        inv.setQuantity(inv.getQuantity() - quantity);
        if (inv.getQuantity() <= 0) {
            inventoryMapper.deleteById(inv.getId());
        } else {
            inventoryMapper.updateById(inv);
        }

        player.setGold(player.getGold() + totalGold);
        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);

        Map<String, Object> result = new HashMap<>();
        result.put("gold", player.getGold());
        result.put("earned", totalGold);
        return result;
    }

    private void addToInventory(Long playerId, Integer itemId, int quantity) {
        LambdaQueryWrapper<PlayerInventory> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerInventory::getPlayerId, playerId).eq(PlayerInventory::getItemId, itemId);
        PlayerInventory inv = inventoryMapper.selectOne(qw);
        if (inv != null) {
            inv.setQuantity(inv.getQuantity() + quantity);
            inventoryMapper.updateById(inv);
        } else {
            inv = new PlayerInventory();
            inv.setPlayerId(playerId);
            inv.setItemId(itemId);
            inv.setQuantity(quantity);
            inv.setIsEquipped(false);
            inventoryMapper.insert(inv);
        }
    }
}
