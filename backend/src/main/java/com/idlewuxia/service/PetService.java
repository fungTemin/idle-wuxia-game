package com.idlewuxia.service;

import com.idlewuxia.vo.PetVO;
import java.util.List;
import java.util.Map;

public interface PetService {
    List<PetVO> getPlayerPets(Long playerId);
    Map<String, Object> summon(Long playerId);
    PetVO upgradePet(Long playerId, Long petId);
    PetVO evolvePet(Long playerId, Long petId);
    PetVO upgradeSkill(Long playerId, Long petId);
    PetVO toggleActive(Long playerId, Long petId);
    List<Map<String, Object>> getCollection(Long playerId);
}
