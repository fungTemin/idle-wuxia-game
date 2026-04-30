package com.idlewuxia.controller;

import com.idlewuxia.service.PetService;
import com.idlewuxia.util.Result;
import com.idlewuxia.vo.PetVO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public Result<List<PetVO>> getPlayerPets(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(petService.getPlayerPets(playerId));
    }

    @PostMapping("/summon")
    public Result<Map<String, Object>> summon(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(petService.summon(playerId));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/upgrade")
    public Result<PetVO> upgradePet(HttpServletRequest request, @PathVariable Long id) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(petService.upgradePet(playerId, id));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/evolve")
    public Result<PetVO> evolvePet(HttpServletRequest request, @PathVariable Long id) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(petService.evolvePet(playerId, id));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/upgrade-skill")
    public Result<PetVO> upgradeSkill(HttpServletRequest request, @PathVariable Long id) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(petService.upgradeSkill(playerId, id));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/{id}/activate")
    public Result<PetVO> toggleActive(HttpServletRequest request, @PathVariable Long id) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(petService.toggleActive(playerId, id));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/collection")
    public Result<List<Map<String, Object>>> getCollection(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(petService.getCollection(playerId));
    }
}
