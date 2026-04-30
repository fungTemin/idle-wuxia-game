package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("achievement")
public class Achievement {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String description;
    private String type;
    private Integer targetValue;
    private String rewardType;
    private Integer rewardValue;
}
