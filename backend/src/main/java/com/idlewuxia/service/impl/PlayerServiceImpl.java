package com.idlewuxia.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.idlewuxia.dto.LoginDTO;
import com.idlewuxia.dto.RegisterDTO;
import com.idlewuxia.entity.Player;
import com.idlewuxia.entity.PlayerAchievement;
import com.idlewuxia.entity.Achievement;
import com.idlewuxia.mapper.PlayerMapper;
import com.idlewuxia.mapper.PlayerAchievementMapper;
import com.idlewuxia.mapper.AchievementMapper;
import com.idlewuxia.service.PlayerService;
import com.idlewuxia.util.JwtUtil;
import com.idlewuxia.vo.IdleRewardVO;
import com.idlewuxia.vo.PlayerVO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerMapper playerMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AchievementMapper achievementMapper;
    private final PlayerAchievementMapper playerAchievementMapper;

    public PlayerServiceImpl(PlayerMapper playerMapper, PasswordEncoder passwordEncoder,
                             JwtUtil jwtUtil, AchievementMapper achievementMapper,
                             PlayerAchievementMapper playerAchievementMapper) {
        this.playerMapper = playerMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.achievementMapper = achievementMapper;
        this.playerAchievementMapper = playerAchievementMapper;
    }

    @Override
    public Map<String, Object> register(RegisterDTO dto) {
        LambdaQueryWrapper<Player> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Player::getUsername, dto.getUsername());
        if (playerMapper.selectOne(wrapper) != null) {
            throw new RuntimeException("用户名已存在");
        }

        Player player = new Player();
        player.setUsername(dto.getUsername());
        player.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        player.setNickname(dto.getNickname());
        player.setLevel(1);
        player.setExp(0L);
        player.setGold(500L);
        player.setDiamond(100);
        player.setAttack(10);
        player.setDefense(5);
        player.setHp(100);
        player.setMaxHp(100);
        player.setIdleGoldRate(new BigDecimal("1.0"));
        player.setIdleExpRate(new BigDecimal("0.5"));
        player.setCurrentStageId(1);
        player.setLastOfflineTime(LocalDateTime.now());
        player.setCreatedAt(LocalDateTime.now());
        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.insert(player);

        initAchievements(player.getId());

        String token = jwtUtil.generateToken(player.getId(), player.getUsername());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("player", toPlayerVO(player));
        return result;
    }

    @Override
    public Map<String, Object> login(LoginDTO dto) {
        LambdaQueryWrapper<Player> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Player::getUsername, dto.getUsername());
        Player player = playerMapper.selectOne(wrapper);

        if (player == null || !passwordEncoder.matches(dto.getPassword(), player.getPasswordHash())) {
            throw new RuntimeException("用户名或密码错误");
        }

        player.setLastOfflineTime(LocalDateTime.now());
        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);

        String token = jwtUtil.generateToken(player.getId(), player.getUsername());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("player", toPlayerVO(player));
        return result;
    }

    @Override
    public PlayerVO getPlayerInfo(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) throw new RuntimeException("玩家不存在");
        return toPlayerVO(player);
    }

    @Override
    public IdleRewardVO collectIdleReward(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) throw new RuntimeException("玩家不存在");

        LocalDateTime now = LocalDateTime.now();
        long seconds = Duration.between(player.getLastOfflineTime(), now).getSeconds();
        if (seconds < 1) seconds = 1;
        // Cap at 24 hours
        if (seconds > 86400) seconds = 86400;

        long goldEarned = player.getIdleGoldRate()
                .multiply(BigDecimal.valueOf(seconds))
                .setScale(0, RoundingMode.FLOOR)
                .longValue();
        long expEarned = player.getIdleExpRate()
                .multiply(BigDecimal.valueOf(seconds))
                .setScale(0, RoundingMode.FLOOR)
                .longValue();

        player.setGold(player.getGold() + goldEarned);
        player.setExp(player.getExp() + expEarned);
        player.setLastOfflineTime(now);
        player.setUpdatedAt(now);

        boolean levelUp = false;
        int newLevel = player.getLevel();
        while (player.getExp() >= getExpToNextLevel(player.getLevel())) {
            player.setExp(player.getExp() - getExpToNextLevel(player.getLevel()));
            player.setLevel(player.getLevel() + 1);
            player.setAttack(player.getAttack() + 3);
            player.setDefense(player.getDefense() + 2);
            player.setMaxHp(player.getMaxHp() + 20);
            player.setHp(player.getMaxHp());
            player.setIdleGoldRate(player.getIdleGoldRate().add(new BigDecimal("0.2")));
            player.setIdleExpRate(player.getIdleExpRate().add(new BigDecimal("0.1")));
            levelUp = true;
            newLevel = player.getLevel();
        }
        playerMapper.updateById(player);

        updateAchievementProgress(playerId, "level", player.getLevel());
        updateAchievementProgress(playerId, "gold", player.getGold().intValue());

        IdleRewardVO vo = new IdleRewardVO();
        vo.setGoldEarned(goldEarned);
        vo.setExpEarned(expEarned);
        vo.setOfflineSeconds((int) seconds);
        vo.setLevelUp(levelUp);
        vo.setNewLevel(newLevel);
        return vo;
    }

    @Override
    public PlayerVO upgrade(Long playerId) {
        Player player = playerMapper.selectById(playerId);
        if (player == null) throw new RuntimeException("玩家不存在");

        long expNeeded = getExpToNextLevel(player.getLevel());
        if (player.getExp() < expNeeded) {
            throw new RuntimeException("经验不足，需要" + expNeeded + "经验");
        }

        player.setExp(player.getExp() - expNeeded);
        player.setLevel(player.getLevel() + 1);
        player.setAttack(player.getAttack() + 3);
        player.setDefense(player.getDefense() + 2);
        player.setMaxHp(player.getMaxHp() + 20);
        player.setHp(player.getMaxHp());
        player.setIdleGoldRate(player.getIdleGoldRate().add(new BigDecimal("0.2")));
        player.setIdleExpRate(player.getIdleExpRate().add(new BigDecimal("0.1")));
        player.setUpdatedAt(LocalDateTime.now());
        playerMapper.updateById(player);

        updateAchievementProgress(playerId, "level", player.getLevel());
        return toPlayerVO(player);
    }

    private long getExpToNextLevel(int level) {
        return (long) (100 * Math.pow(1.5, level - 1));
    }

    private PlayerVO toPlayerVO(Player player) {
        PlayerVO vo = new PlayerVO();
        vo.setId(player.getId());
        vo.setUsername(player.getUsername());
        vo.setNickname(player.getNickname());
        vo.setLevel(player.getLevel());
        vo.setExp(player.getExp());
        vo.setGold(player.getGold());
        vo.setDiamond(player.getDiamond());
        vo.setAttack(player.getAttack());
        vo.setDefense(player.getDefense());
        vo.setHp(player.getHp());
        vo.setMaxHp(player.getMaxHp());
        vo.setIdleGoldRate(player.getIdleGoldRate());
        vo.setIdleExpRate(player.getIdleExpRate());
        vo.setCurrentStageId(player.getCurrentStageId());
        vo.setExpToNextLevel(getExpToNextLevel(player.getLevel()));
        vo.setCreatedAt(player.getCreatedAt());
        return vo;
    }

    private void initAchievements(Long playerId) {
        List<Achievement> achievements = achievementMapper.selectList(null);
        for (Achievement a : achievements) {
            PlayerAchievement pa = new PlayerAchievement();
            pa.setPlayerId(playerId);
            pa.setAchievementId(a.getId());
            pa.setCurrentValue(0);
            pa.setIsCompleted(false);
            pa.setIsRewarded(false);
            playerAchievementMapper.insert(pa);
        }
    }

    private void updateAchievementProgress(Long playerId, String type, int currentValue) {
        LambdaQueryWrapper<Achievement> aq = new LambdaQueryWrapper<>();
        aq.eq(Achievement::getType, type);
        List<Achievement> achievements = achievementMapper.selectList(aq);

        for (Achievement a : achievements) {
            LambdaQueryWrapper<PlayerAchievement> pq = new LambdaQueryWrapper<>();
            pq.eq(PlayerAchievement::getPlayerId, playerId)
              .eq(PlayerAchievement::getAchievementId, a.getId());
            PlayerAchievement pa = playerAchievementMapper.selectOne(pq);
            if (pa != null && !pa.getIsCompleted()) {
                pa.setCurrentValue(Math.min(currentValue, a.getTargetValue()));
                if (currentValue >= a.getTargetValue()) {
                    pa.setIsCompleted(true);
                    pa.setCompletedAt(LocalDateTime.now());
                }
                playerAchievementMapper.updateById(pa);
            }
        }
    }
}
