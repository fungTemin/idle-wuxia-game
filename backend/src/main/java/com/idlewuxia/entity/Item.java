package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("item")
public class Item {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String description;
    private String type;
    private String rarity;
    private Integer attackBonus;
    private Integer defenseBonus;
    private Integer hpBonus;
    private Integer buyPrice;
    private Integer sellPrice;
    private String imageUrl;
}
