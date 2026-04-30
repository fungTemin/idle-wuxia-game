package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("shop_item")
public class ShopItem {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer itemId;
    private Integer petTemplateId;
    private String priceType;
    private Integer price;
    private Integer stock;
    private Boolean isActive;

    @TableField(exist = false)
    private Item item;
    @TableField(exist = false)
    private PetTemplate petTemplate;
}
