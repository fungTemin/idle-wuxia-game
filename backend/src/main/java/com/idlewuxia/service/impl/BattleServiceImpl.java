package com.idlewuxia.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.idlewuxia.entity.*;
import com.idlewuxia.mapper.*;
import com.idlewuxia.service.BattleService;
import com.idlewuxia.vo.BattleResultVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BattleServiceImpl implements BattleService {

    private final StageMapper stageMapper;
    private final PlayerMapper playerMapper;
    private final PlayerPetMapper playerPetMapper;
    private final PetTemplateMapper petTemplateMapper;
    private final PlayerInventoryMapper inventoryMapper;
    private final ItemMapper itemMapper;
    private final AchievementMapper achievementMapper;
    private final PlayerAchievementMapper playerAchievementMapper;

    public BattleServiceImpl(StageMapper stageMapper, PlayerMapper playerMapper,
                             PlayerPetMapper playerPetMapper, PetTemplateMapper petTemplateMapper,
                             PlayerInventoryMapper inventoryMapper, ItemMapper itemMapper,
                             AchievementMapper achievementMapper, PlayerAchievementMapper playerAchievementMapper) {
        this.stageMapper = stageMapper;
        this.playerMapper = playerMapper;
        this.playerPetMapper = playerPetMapper;
        this.petTemplateMapper = petTemplateMapper;
        this.inventoryMapper = inventoryMapper;
        this.itemMapper = itemMapper;
        this.achievementMapper = achievementMapper;
        this.playerAchievementMapper = playerAchievementMapper;
    }

    @Override
    public List<Map<String, Object>> getStages(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        List<Stage> stages = stageMapper.selectList(null);
        return stages.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getName());
            map.put("chapter", s.getChapter());
            map.put("stageOrder", s.getStageOrder());
            map.put("description", s.getDescription());
            map.put("monsterName", s.getMonsterName());
            map.put("monsterAttack", s.getMonsterAttack());
            map.put("monsterDefense", s.getMonsterDefense());
            map.put("monsterHp", s.getMonsterHp());
            map.put("goldReward", s.getGoldReward());
            map.put("expReward", s.getExpReward());
            map.put("requiredLevel", s.getRequiredLevel());
            map.put("unlocked", player.getCurrentStageId() >= s.getId());
            map.put("current", player.getCurrentStageId().equals(s.getId()));
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getCurrentStage(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        Stage stage = stageMapper.selectById(player.getCurrentStageId());
        Map<String, Object> map = new HashMap<>();
        map.put("stage", stage);
        map.put("playerPower", calculatePlayerPower(player));
        return map;
    }

    @Override
    @Transactional
    public BattleResultVO startBattle(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) throw new RuntimeException("玩家不存在");

        Stage stage = stageMapper.selectById(player.getCurrentStageId());
        if (stage == null) throw new RuntimeException("当前关卡不存在");

        if (player.getLevel() < stage.getRequiredLevel()) {
            throw new RuntimeException("等级不足，需要" + stage.getRequiredLevel() + "级");
        }

        int playerAttack = player.getAttack();
        int playerDefense = player.getDefense();
        int playerHp = player.getMaxHp();

        LambdaQueryWrapper<PlayerPet> aq = new LambdaQueryWrapper<>();
        aq.eq(PlayerPet::getPlayerId, playerId).eq(PlayerPet::getIsActive, true);
        List<PlayerPet> activePets = playerPetMapper.selectList(aq);
        for (PlayerPet pet : activePets) {
            PetTemplate template = petTemplateMapper.selectById(pet.getPetTemplateId());
            playerAttack += pet.getAttack();
            playerDefense += pet.getDefense();
            playerHp += pet.getHp();
            if (template != null) {
                playerAttack += template.getSkillDamage() * pet.getSkillLevel() / 10;
            }
        }

        List<String> battleLog = new ArrayList<>();
        int monsterHp = stage.getMonsterHp();
        int monsterAttack = stage.getMonsterAttack();
        int monsterDefense = stage.getMonsterDefense();
        int turn = 0;

        while (playerHp > 0 && monsterHp > 0 && turn < 50) {
            turn++;
            int playerDmg = Math.max(1, playerAttack - monsterDefense);
            monsterHp -= playerDmg;
            battleLog.add("第" + turn + "回合: 你对" + stage.getMonsterName() + "造成" + playerDmg + "点伤害");

            if (monsterHp <= 0) break;

            int monsterDmg = Math.max(1, monsterAttack - playerDefense);
            playerHp -= monsterDmg;
            battleLog.add("第" + turn + "回合: " + stage.getMonsterName() + "对你造成" + monsterDmg + "点伤害");
        }

        BattleResultVO result = new BattleResultVO();
        result.setStageName(stage.getName());
        result.setMonsterName(stage.getMonsterName());
        result.setBattleLog(battleLog);

        if (monsterHp <= 0) {
            result.setVictory(true);
            result.setGoldReward(stage.getGoldReward());
            result.setExpReward(stage.getExpReward());
            result.setMaterialType(stage.getMaterialType());
            result.setMaterialAmount(stage.getMaterialAmount());

            player.setGold(player.getGold() + stage.getGoldReward());
            player.setExp(player.getExp() + stage.getExpReward());

            if (stage.getMaterialType() != null && stage.getMaterialAmount() > 0) {
                addMaterial(playerId, stage.getMaterialType(), stage.getMaterialAmount());
            }

            boolean levelUp = false;
            while (player.getExp() >= getExpToNextLevel(player.getLevel())) {
                player.setExp(player.getExp() - getExpToNextLevel(player.getLevel()));
                player.setLevel(player.getLevel() + 1);
                player.setAttack(player.getAttack() + 3);
                player.setDefense(player.getDefense() + 2);
                player.setMaxHp(player.getMaxHp() + 20);
                player.setHp(player.getMaxHp());
                player.setIdleGoldRate(player.getIdleGoldRate().add(new java.math.BigDecimal("0.2")));
                player.setIdleExpRate(player.getIdleExpRate().add(new java.math.BigDecimal("0.1")));
                levelUp = true;
            }
            result.setLevelUp(levelUp);
            result.setNewLevel(player.getLevel());

            // Unlock next stage
            Stage nextStage = getNextStage(stage);
            if (nextStage != null && player.getCurrentStageId() < nextStage.getId()) {
                player.setCurrentStageId(nextStage.getId());
                result.setStageUnlocked(true);
            }

            player.setUpdatedAt(LocalDateTime.now());
            playerMapper.updateById(player);

            updateStageAchievement(playerId, player.getCurrentStageId());
            updateAchievementProgress(playerId, "level", player.getLevel());
            updateAchievementProgress(playerId, "gold", player.getGold().intValue());
        } else {
            result.setVictory(false);
        }
        return result;
    }

    @Override
    @Transactional
    public BattleResultVO quickBattle(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) throw new RuntimeException("玩家不存在");

        // Quick battle uses current stage - 1 (already cleared)
        int clearedStageId = player.getCurrentStageId() - 1;
        if (clearedStageId < 1) clearedStageId = 1;
        Stage stage = stageMapper.selectById(clearedStageId);
        if (stage == null) throw new RuntimeException("无可扫荡关卡");

        BattleResultVO result = new BattleResultVO();
        result.setVictory(true);
        result.setStageName(stage.getName());
        result.setMonsterName(stage.getMonsterName());
        result.setBattleLog(List.of("扫荡完成！"));
        result.setGoldReward(stage.getGoldReward());
        result.setExpReward(stage.getExpReward());
        result.setMaterialType(stage.getMaterialType());
        result.setMaterialAmount(stage.getMaterialAmount());

        player.setGold(player.getGold() + stage.getGoldReward());
        player.setExp(player.getExp() + stage.getExpReward());

        if (stage.getMaterialType() != null && stage.getMaterialAmount() > 0) {
            addMaterial(playerId, stage.getMaterialType(), stage.getMaterialAmount());
        }

        boolean levelUp = false;
        while (player.getExp() >= getExpToNextLevel(player.getLevel())) {
            player.setExp(player.getExp() - getExpToNextLevel(player.getLevel()));
            player.setLevel(player.getLevel() + 1);
            player.setAttack(player.getAttack() + 3);
            player.setDefense(player.getDefense() + 2);
            player.setMaxHp(player.getMaxHp() + 20);
            player.setHp(player.getMaxHp());
            player.setIdleGoldRate(player.getIdleGoldRate().add(new java.math.BigDecimal("0.2")));
            player.setIdleExpRate(player.getIdleExpRate().add(new java.math.BigDecimal("0.1")));
            levelUp = true;
        }
        result.setLevelUp(levelUp);
        result.setNewLevel(player.getLevel());

        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);

        return result;
    }

    private int calculatePlayerPower(Player player) {
        return player.getAttack() + player.getDefense() + player.getMaxHp() / 10;
    }

    private long getExpToNextLevel(int level) {
        return (long) (100 * Math.pow(1.5, level - 1));
    }

    private Stage getNextStage(Stage current) {
        LambdaQueryWrapper<Stage> qw = new LambdaQueryWrapper<>();
        qw.gt(Stage::getId, current.getId()).orderByAsc(Stage::getId).last("LIMIT 1");
        return stageMapper.selectOne(qw);
    }

    private void addMaterial(Long playerId, String materialName, int amount) {
        LambdaQueryWrapper<Item> iq = new LambdaQueryWrapper<>();
        iq.eq(Item::getName, materialName).eq(Item::getType, "material");
        Item material = itemMapper.selectOne(iq);
        if (material == null) return;

        LambdaQueryWrapper<PlayerInventory> pq = new LambdaQueryWrapper<>();
        pq.eq(PlayerInventory::getPlayerId, playerId).eq(PlayerInventory::getItemId, material.getId());
        PlayerInventory inv = inventoryMapper.selectOne(pq);
        if (inv != null) {
            inv.setQuantity(inv.getQuantity() + amount);
            inventoryMapper.updateById(inv);
        } else {
            inv = new PlayerInventory();
            inv.setPlayerId(playerId);
            inv.setItemId(material.getId());
            inv.setQuantity(amount);
            inv.setIsEquipped(false);
            inventoryMapper.insert(inv);
        }
    }

    private void updateStageAchievement(Long playerId, int currentStageId) {
        LambdaQueryWrapper<Achievement> aq = new LambdaQueryWrapper<>();
        aq.eq(Achievement::getType, "stage");
        List<Achievement> achievements = achievementMapper.selectList(aq);
        for (Achievement a : achievements) {
            LambdaQueryWrapper<PlayerAchievement> pq = new LambdaQueryWrapper<>();
            pq.eq(PlayerAchievement::getPlayerId, playerId)
              .eq(PlayerAchievement::getAchievementId, a.getId());
            PlayerAchievement pa = playerAchievementMapper.selectOne(pq);
            if (pa != null && !pa.getIsCompleted()) {
                pa.setCurrentValue(Math.min(currentStageId, a.getTargetValue()));
                if (currentStageId >= a.getTargetValue()) {
                    pa.setIsCompleted(true);
                    pa.setCompletedAt(LocalDateTime.now());
                }
                playerAchievementMapper.updateById(pa);
            }
        }
    }

    private void updateAchievementProgress(Long playerId, String type, int value) {
        LambdaQueryWrapper<Achievement> aq = new LambdaQueryWrapper<>();
        aq.eq(Achievement::getType, type);
        List<Achievement> achievements = achievementMapper.selectList(aq);
        for (Achievement a : achievements) {
            LambdaQueryWrapper<PlayerAchievement> pq = new LambdaQueryWrapper<>();
            pq.eq(PlayerAchievement::getPlayerId, playerId)
              .eq(PlayerAchievement::getAchievementId, a.getId());
            PlayerAchievement pa = playerAchievementMapper.selectOne(pq);
            if (pa != null && !pa.getIsCompleted()) {
                pa.setCurrentValue(Math.min(value, a.getTargetValue()));
                if (value >= a.getTargetValue()) {
                    pa.setIsCompleted(true);
                    pa.setCompletedAt(LocalDateTime.now());
                }
                playerAchievementMapper.updateById(pa);
            }
        }
    }
}
