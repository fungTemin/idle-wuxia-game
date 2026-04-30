package com.idlewuxia.service;

import com.idlewuxia.dto.BuyDTO;
import com.idlewuxia.vo.ShopItemVO;
import java.util.List;
import java.util.Map;

public interface ShopService {
    List<ShopItemVO> getShopItems(Long playerId);
    Map<String, Object> buy(Long playerId, BuyDTO dto);
    Map<String, Object> sell(Long playerId, Integer inventoryId, Integer quantity);
}
