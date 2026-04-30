package com.idlewuxia.service;

import com.idlewuxia.dto.LoginDTO;
import com.idlewuxia.dto.RegisterDTO;
import com.idlewuxia.vo.IdleRewardVO;
import com.idlewuxia.vo.PlayerVO;

import java.util.Map;

public interface PlayerService {
    Map<String, Object> register(RegisterDTO dto);
    Map<String, Object> login(LoginDTO dto);
    PlayerVO getPlayerInfo(Long playerId);
    IdleRewardVO collectIdleReward(Long playerId);
    PlayerVO upgrade(Long playerId);
}
