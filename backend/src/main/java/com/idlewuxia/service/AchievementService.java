package com.idlewuxia.service;

import com.idlewuxia.vo.AchievementVO;
import java.util.List;
import java.util.Map;

public interface AchievementService {
    List<AchievementVO> getPlayerAchievements(Long playerId);
    Map<String, Object> claimReward(Long playerId, Integer achievementId);
}
