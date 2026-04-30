package com.idlewuxia.controller;

import com.idlewuxia.dto.BuyDTO;
import com.idlewuxia.service.ShopService;
import com.idlewuxia.util.Result;
import com.idlewuxia.vo.ShopItemVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("/items")
    public Result<List<ShopItemVO>> getShopItems(HttpServletRequest request) {
        Long playerId = (Long) request.getAttribute("playerId");
        return Result.success(shopService.getShopItems(playerId));
    }

    @PostMapping("/buy")
    public Result<Map<String, Object>> buy(HttpServletRequest request, @Valid @RequestBody BuyDTO dto) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(shopService.buy(playerId, dto));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/sell")
    public Result<Map<String, Object>> sell(HttpServletRequest request,
                                             @RequestParam Integer inventoryId,
                                             @RequestParam(defaultValue = "1") Integer quantity) {
        Long playerId = (Long) request.getAttribute("playerId");
        try {
            return Result.success(shopService.sell(playerId, inventoryId, quantity));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
