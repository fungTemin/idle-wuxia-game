package com.idlewuxia.vo;

import lombok.Data;
import java.util.List;

@Data
public class BattleResultVO {
    private boolean victory;
    private String stageName;
    private String monsterName;
    private List<String> battleLog;
    private Integer goldReward;
    private Integer expReward;
    private String materialType;
    private Integer materialAmount;
    private boolean levelUp;
    private Integer newLevel;
    private boolean stageUnlocked;
}
