package com.idlewuxia.controller;

import com.idlewuxia.service.BattleService;
import com.idlewuxia.util.Result;
import com.idlewuxia.vo.BattleResultVO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BattleController {

    private final BattleService battleService;

    public BattleController(BattleService battleService) {
        this.battleService = battleService;
    }

    @GetMapping("/stages")
    public Result<List<Map<String, Object>>> getStages(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(battleService.getStages(playerId));
    }

    @GetMapping("/stages/current")
    public Result<Map<String, Object>> getCurrentStage(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(battleService.getCurrentStage(playerId));
    }

    @PostMapping("/battle/start")
    public Result<BattleResultVO> startBattle(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(battleService.startBattle(playerId));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/battle/quick")
    public Result<BattleResultVO> quickBattle(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(battleService.quickBattle(playerId));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
