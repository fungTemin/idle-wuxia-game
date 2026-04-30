package com.idlewuxia.service;

import com.idlewuxia.vo.BattleResultVO;
import java.util.List;
import java.util.Map;

public interface BattleService {
    List<Map<String, Object>> getStages(Long playerId);
    Map<String, Object> getCurrentStage(Long playerId);
    BattleResultVO startBattle(Long playerId);
    BattleResultVO quickBattle(Long playerId);
}
