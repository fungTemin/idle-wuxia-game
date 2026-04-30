package com.idlewuxia.vo;

import lombok.Data;

@Data
public class ShopItemVO {
    private Integer id;
    private String name;
    private String description;
    private String type;
    private String rarity;
    private Integer attackBonus;
    private Integer defenseBonus;
    private Integer hpBonus;
    private String priceType;
    private Integer price;
    private Integer stock;
    private Boolean isPet;
    private Integer petTemplateId;
}
