package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("player_achievement")
public class PlayerAchievement {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long playerId;
    private Integer achievementId;
    private Integer currentValue;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Boolean isRewarded;

    @TableField(exist = false)
    private Achievement achievement;
}
