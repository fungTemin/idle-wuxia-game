package com.idlewuxia.controller;

import com.idlewuxia.service.AchievementService;
import com.idlewuxia.util.Result;
import com.idlewuxia.vo.AchievementVO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public Result<List<AchievementVO>> getAchievements(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(achievementService.getPlayerAchievements(playerId));
    }

    @PostMapping("/{id}/claim")
    public Result<Map<String, Object>> claimReward(HttpServletRequest request, @PathVariable Integer id) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(achievementService.claimReward(playerId, id));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
