package com.idlewuxia.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PlayerVO {
    private Long id;
    private String username;
    private String nickname;
    private Integer level;
    private Long exp;
    private Long gold;
    private Integer diamond;
    private Integer attack;
    private Integer defense;
    private Integer hp;
    private Integer maxHp;
    private BigDecimal idleGoldRate;
    private BigDecimal idleExpRate;
    private Integer currentStageId;
    private Long expToNextLevel;
    private LocalDateTime createdAt;
}
