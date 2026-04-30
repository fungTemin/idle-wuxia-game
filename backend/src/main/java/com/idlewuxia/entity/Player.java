package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("player")
public class Player {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    private String passwordHash;
    private String nickname;
    private Integer level;
    private Long exp;
    private Long gold;
    private Integer diamond;
    private Integer attack;
    private Integer defense;
    private Integer hp;
    private Integer maxHp;
    private LocalDateTime lastOfflineTime;
    private BigDecimal idleGoldRate;
    private BigDecimal idleExpRate;
    private Integer currentStageId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
