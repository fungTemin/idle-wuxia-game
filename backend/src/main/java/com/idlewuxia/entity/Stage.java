package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("stage")
public class Stage {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private Integer chapter;
    private Integer stageOrder;
    private String description;
    private String monsterName;
    private Integer monsterAttack;
    private Integer monsterDefense;
    private Integer monsterHp;
    private Integer goldReward;
    private Integer expReward;
    private String materialType;
    private Integer materialAmount;
    private Integer requiredLevel;
}
