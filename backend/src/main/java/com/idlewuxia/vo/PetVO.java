package com.idlewuxia.vo;

import lombok.Data;

@Data
public class PetVO {
    private Long id;
    private Integer petTemplateId;
    private String name;
    private String description;
    private String rarity;
    private Integer level;
    private Long exp;
    private Integer attack;
    private Integer defense;
    private Integer hp;
    private String skillName;
    private String skillDesc;
    private Integer skillLevel;
    private Integer skillDamage;
    private Boolean isActive;
    private Integer slotPosition;
    private Integer evolutionTo;
    private Integer evolutionCost;
}
