package com.idlewuxia.controller;

import com.idlewuxia.service.PlayerService;
import com.idlewuxia.util.Result;
import com.idlewuxia.vo.IdleRewardVO;
import com.idlewuxia.vo.PlayerVO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/info")
    public Result<PlayerVO> getPlayerInfo(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(playerService.getPlayerInfo(playerId));
    }

    @PostMapping("/idle-reward")
    public Result<IdleRewardVO> collectIdleReward(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(playerService.collectIdleReward(playerId));
    }

    @PostMapping("/upgrade")
    public Result<PlayerVO> upgrade(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(playerService.upgrade(playerId));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
