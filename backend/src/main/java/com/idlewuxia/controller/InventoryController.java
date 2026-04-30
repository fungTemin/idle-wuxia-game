package com.idlewuxia.controller;

import com.idlewuxia.service.InventoryService;
import com.idlewuxia.util.Result;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public Result<List<Map<String, Object>>> getInventory(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(inventoryService.getInventory(playerId));
    }

    @PostMapping("/equip")
    public Result<Map<String, Object>> equip(HttpServletRequest request, @RequestParam Integer inventoryId) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(inventoryService.equip(playerId, inventoryId));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/unequip")
    public Result<Map<String, Object>> unequip(HttpServletRequest request, @RequestParam Integer inventoryId) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(inventoryService.unequip(playerId, inventoryId));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
