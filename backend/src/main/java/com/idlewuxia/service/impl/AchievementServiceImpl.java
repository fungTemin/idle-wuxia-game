package com.idlewuxia.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.idlewuxia.entity.*;
import com.idlewuxia.mapper.*;
import com.idlewuxia.service.AchievementService;
import com.idlewuxia.vo.AchievementVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final AchievementMapper achievementMapper;
    private final PlayerAchievementMapper playerAchievementMapper;
    private final PlayerMapper playerMapper;

    public AchievementServiceImpl(AchievementMapper achievementMapper,
                                  PlayerAchievementMapper playerAchievementMapper,
                                  PlayerMapper playerMapper) {
        this.achievementMapper = achievementMapper;
        this.playerAchievementMapper = playerAchievementMapper;
        this.playerMapper = playerMapper;
    }

    @Override
    public List<AchievementVO> getPlayerAchievements(Long playerId) {
        LambdaQueryWrapper<PlayerAchievement> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerAchievement::getPlayerId, playerId);
        List<PlayerAchievement> playerAchievements = playerAchievementMapper.selectList(qw);

        return playerAchievements.stream().map(pa -> {
            Achievement achievement = achievementMapper.selectById(pa.getAchievementId());
            AchievementVO vo = new AchievementVO();
            vo.setId(pa.getAchievementId());
            if (achievement != null) {
                vo.setName(achievement.getName());
                vo.setDescription(achievement.getDescription());
                vo.setType(achievement.getType());
                vo.setTargetValue(achievement.getTargetValue());
                vo.setRewardType(achievement.getRewardType());
                vo.setRewardValue(achievement.getRewardValue());
            }
            vo.setCurrentValue(pa.getCurrentValue());
            vo.setIsCompleted(pa.getIsCompleted());
            vo.setIsRewarded(pa.getIsRewarded());
            if (achievement != null && achievement.getTargetValue() > 0) {
                vo.setProgress((double) pa.getCurrentValue() / achievement.getTargetValue() * 100);
            } else {
                vo.setProgress(0.0);
            }
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> claimReward(Long playerId, Integer achievementId) {
        LambdaQueryWrapper<PlayerAchievement> qw = new LambdaQueryWrapper<>();
        qw.eq(PlayerAchievement::getPlayerId, playerId)
          .eq(PlayerAchievement::getAchievementId, achievementId);
        PlayerAchievement pa = playerAchievementMapper.selectOne(qw);

        if (pa == null) throw new RuntimeException("成就不存在");
        if (!pa.getIsCompleted()) throw new RuntimeException("成就未完成");
        if (pa.getIsRewarded()) throw new RuntimeException("奖励已领取");

        Achievement achievement = achievementMapper.selectById(achievementId);
        Player player = playerMapper.selectById(playerId);

        if ("gold".equals(achievement.getRewardType())) {
            player.setGold(player.getGold() + achievement.getRewardValue());
        } else if ("diamond".equals(achievement.getRewardType())) {
            player.setDiamond(player.getDiamond() + achievement.getRewardValue());
        }
        playerMapper.updateById(player);

        pa.setIsRewarded(true);
        playerAchievementMapper.updateById(pa);

        Map<String, Object> result = new HashMap<>();
        result.put("rewardType", achievement.getRewardType());
        result.put("rewardValue", achievement.getRewardValue());
        result.put("gold", player.getGold());
        result.put("diamond", player.getDiamond());
        return result;
    }
}
