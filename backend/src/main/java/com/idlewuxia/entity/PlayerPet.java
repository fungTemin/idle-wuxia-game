package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("player_pet")
public class PlayerPet {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long playerId;
    private Integer petTemplateId;
    private Integer level;
    private Long exp;
    private Integer attack;
    private Integer defense;
    private Integer hp;
    private Integer skillLevel;
    private Boolean isActive;
    private Integer slotPosition;
    private LocalDateTime createdAt;

    @TableField(exist = false)
    private PetTemplate petTemplate;
}
