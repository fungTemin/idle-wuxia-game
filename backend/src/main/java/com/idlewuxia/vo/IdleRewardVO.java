package com.idlewuxia.vo;

import lombok.Data;

@Data
public class IdleRewardVO {
    private Long goldEarned;
    private Long expEarned;
    private Integer offlineSeconds;
    private boolean levelUp;
    private Integer newLevel;
}
