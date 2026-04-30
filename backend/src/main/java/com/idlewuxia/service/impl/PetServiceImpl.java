package com.idlewuxia.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.idlewuxia.entity.*;
import com.idlewuxia.mapper.*;
import com.idlewuxia.service.PetService;
import com.idlewuxia.vo.PetVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PetServiceImpl implements PetService {

    private final PlayerPetMapper playerPetMapper;
    private final PetTemplateMapper petTemplateMapper;
    private final PlayerMapper playerMapper;
    private final PlayerAchievementMapper playerAchievementMapper;
    private final AchievementMapper achievementMapper;

    private static final int MAX_ACTIVE_PETS = 3;
    private static final int SUMMON_COST = 200;

    public PetServiceImpl(PlayerPetMapper playerPetMapper, PetTemplateMapper petTemplateMapper,
                          PlayerMapper playerMapper, PlayerAchievementMapper playerAchievementMapper,
                          AchievementMapper achievementMapper) {
        this.playerPetMapper = playerPetMapper;
        this.petTemplateMapper = petTemplateMapper;
        this.playerMapper = playerMapper;
        this.playerAchievementMapper = playerAchievementMapper;
        this.achievementMapper = achievementMapper;
    }

    @Override
    public List<PetVO> getPlayerPets(Long playerId) {
        LambdaQueryWrapper<PlayerPet> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerPet::getPlayerId, playerId).orderByDesc(PlayerPet::getIsActive).orderByAsc(PlayerPet::getCreatedAt);
        List<PlayerPet> pets = playerPetMapper.selectList(qw);
        
        if (pets.isEmpty()) return Collections.emptyList();
        
        // 批量加载宠物模板，避免 N+1 查询
        Set<Integer> templateIds = pets.stream()
                .map(PlayerPet::getPetTemplateId)
                .collect(Collectors.toSet());
        Map<Integer, PetTemplate> templateMap = petTemplateMapper.selectBatchIds(templateIds)
                .stream()
                .collect(Collectors.toMap(PetTemplate::getId, t -> t));
        
        return pets.stream()
                .map(pet -> toPetVO(pet, templateMap.get(pet.getPetTemplateId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> summon(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) throw new RuntimeException("玩家不存在");
        if (player.getDiamond() < SUMMON_COST) {
            throw new RuntimeException("钻石不足，需要" + SUMMON_COST + "钻石");
        }

        player.setDiamond(player.getDiamond() - SUMMON_COST);
        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);

        List<PetTemplate> allPets = petTemplateMapper.selectList(null);
        Random random = new Random();
        PetTemplate template = allPets.get(random.nextInt(allPets.size()));

        PlayerPet pet = new PlayerPet();
        pet.setPlayerId(playerId);
        pet.setPetTemplateId(template.getId());
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

        updatePetCollectionAchievement(playerId);

        Map<String, Object> result = new HashMap<>();
        result.put("pet", toPetVO(pet));
        result.put("remainingDiamond", player.getDiamond());
        return result;
    }

    @Override
    public PetVO upgradePet(Long playerId, Long petId) {
        PlayerPet pet = getAndVerifyPet(playerId, petId);
        Player player = playerMapper.selectById(playerId);

        long costGold = pet.getLevel() * 50L;
        if (player.getGold() < costGold) {
            throw new RuntimeException("金币不足，需要" + costGold + "金币");
        }

        player.setGold(player.getGold() - costGold);
        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);

        PetTemplate template = petTemplateMapper.selectById(pet.getPetTemplateId());
        pet.setLevel(pet.getLevel() + 1);
        pet.setAttack(pet.getAttack() + template.getBaseAttack() / 5 + 1);
        pet.setDefense(pet.getDefense() + template.getBaseDefense() / 5 + 1);
        pet.setHp(pet.getHp() + template.getBaseHp() / 5 + 2);
        playerPetMapper.updateById(pet);

        return toPetVO(pet);
    }

    @Override
    @Transactional
    public PetVO evolvePet(Long playerId, Long petId) {
        PlayerPet pet = getAndVerifyPet(playerId, petId);
        PetTemplate template = petTemplateMapper.selectById(pet.getPetTemplateId());

        if (template.getEvolutionTo() == null) {
            throw new RuntimeException("该宠物无法进化");
        }
        if (pet.getLevel() < 10) {
            throw new RuntimeException("宠物等级需达到10级才可进化");
        }

        PetTemplate evolvedTemplate = petTemplateMapper.selectById(template.getEvolutionTo());
        if (evolvedTemplate == null) throw new RuntimeException("进化目标不存在");

        pet.setPetTemplateId(evolvedTemplate.getId());
        pet.setLevel(1);
        pet.setExp(0L);
        pet.setAttack(evolvedTemplate.getBaseAttack());
        pet.setDefense(evolvedTemplate.getBaseDefense());
        pet.setHp(evolvedTemplate.getBaseHp());
        playerPetMapper.updateById(pet);

        return toPetVO(pet);
    }

    @Override
    public PetVO upgradeSkill(Long playerId, Long petId) {
        PlayerPet pet = getAndVerifyPet(playerId, petId);
        Player player = playerMapper.selectById(playerId);

        long costGold = pet.getSkillLevel() * 100L;
        if (player.getGold() < costGold) {
            throw new RuntimeException("金币不足，需要" + costGold + "金币");
        }

        player.setGold(player.getGold() - costGold);
        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);

        pet.setSkillLevel(pet.getSkillLevel() + 1);
        playerPetMapper.updateById(pet);

        return toPetVO(pet);
    }

    @Override
    public PetVO toggleActive(Long playerId, Long petId) {
        PlayerPet pet = getAndVerifyPet(playerId, petId);

        if (pet.getIsActive()) {
            pet.setIsActive(false);
            pet.setSlotPosition(0);
            playerPetMapper.updateById(pet);
        } else {
            LambdaQueryWrapper<PlayerPet> qw = new LambdaQueryWrapper<>();
            qw.eq(PlayerPet::getPlayerId, playerId).eq(PlayerPet::getIsActive, true);
            long activeCount = playerPetMapper.selectCount(qw);
            if (activeCount >= MAX_ACTIVE_PETS) {
                throw new RuntimeException("最多上阵" + MAX_ACTIVE_PETS + "只宠物");
            }
            pet.setIsActive(true);
            pet.setSlotPosition((int) activeCount + 1);
            playerPetMapper.updateById(pet);
        }
        return toPetVO(pet);
    }

    @Override
    public List<Map<String, Object>> getCollection(Long playerId) {
        List<PetTemplate> allTemplates = petTemplateMapper.selectList(null);
        LambdaQueryWrapper<PlayerPet> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerPet::getPlayerId, playerId);
        List<PlayerPet> ownedPets = playerPetMapper.selectList(qw);
        Set<Integer> ownedIds = ownedPets.stream()
                .map(PlayerPet::getPetTemplateId)
                .collect(Collectors.toSet());

        List<Map<String, Object>> collection = new ArrayList<>();
        for (PetTemplate t : allTemplates) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", t.getId());
            entry.put("name", t.getName());
            entry.put("description", t.getDescription());
            entry.put("rarity", t.getRarity());
            entry.put("owned", ownedIds.contains(t.getId()));
            collection.add(entry);
        }
        return collection;
    }

    private PlayerPet getAndVerifyPet(Long playerId, Long petId) {
        LambdaQueryWrapper<PlayerPet> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerPet::getId, petId).eq(PlayerPet::getPlayerId, playerId);
        PlayerPet pet = playerPetMapper.selectOne(qw);
        if (pet == null) throw new RuntimeException("宠物不存在");
        return pet;
    }

    private PetVO toPetVO(PlayerPet pet) {
        PetTemplate template = petTemplateMapper.selectById(pet.getPetTemplateId());
        return toPetVO(pet, template);
    }

    private PetVO toPetVO(PlayerPet pet, PetTemplate template) {
        PetVO vo = new PetVO();
        vo.setId(pet.getId());
        vo.setPetTemplateId(pet.getPetTemplateId());
        vo.setName(template != null ? template.getName() : "未知");
        vo.setDescription(template != null ? template.getDescription() : "");
        vo.setRarity(template != null ? template.getRarity() : "N");
        vo.setLevel(pet.getLevel());
        vo.setExp(pet.getExp());
        vo.setAttack(pet.getAttack());
        vo.setDefense(pet.getDefense());
        vo.setHp(pet.getHp());
        vo.setSkillName(template != null ? template.getSkillName() : "");
        vo.setSkillDesc(template != null ? template.getSkillDesc() : "");
        vo.setSkillLevel(pet.getSkillLevel());
        vo.setSkillDamage(template != null ? template.getSkillDamage() : 0);
        vo.setIsActive(pet.getIsActive());
        vo.setSlotPosition(pet.getSlotPosition());
        vo.setEvolutionTo(template != null ? template.getEvolutionTo() : null);
        vo.setEvolutionCost(template != null ? template.getEvolutionCost() : 0);
        return vo;
    }

    private void updatePetCollectionAchievement(Long playerId) {
        LambdaQueryWrapper<PlayerPet> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerPet::getPlayerId, playerId);
        long count = playerPetMapper.selectCount(qw);

        LambdaQueryWrapper<Achievement> aq = new LambdaQueryWrapper<>();
        aq.eq(Achievement::getType, "pet_collect");
        List<Achievement> achievements = achievementMapper.selectList(aq);

        for (Achievement a : achievements) {
            LambdaQueryWrapper<PlayerAchievement> pq = new LambdaQueryWrapper<>();
            pq.eq(PlayerAchievement::getPlayerId, playerId)
              .eq(PlayerAchievement::getAchievementId, a.getId());
            PlayerAchievement pa = playerAchievementMapper.selectOne(pq);
            if (pa != null && !pa.getIsCompleted()) {
                pa.setCurrentValue((int) Math.min(count, a.getTargetValue()));
                if (count >= a.getTargetValue()) {
                    pa.setIsCompleted(true);
                    pa.setCompletedAt(LocalDateTime.now());
                }
                playerAchievementMapper.updateById(pa);
            }
        }
    }
}
