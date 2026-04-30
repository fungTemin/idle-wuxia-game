package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("pet_template")
public class PetTemplate {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String description;
    private String rarity;
    private Integer baseAttack;
    private Integer baseDefense;
    private Integer baseHp;
    private String skillName;
    private String skillDesc;
    private Integer skillDamage;
    private Integer evolutionTo;
    private Integer evolutionCost;
    private String imageUrl;
}
