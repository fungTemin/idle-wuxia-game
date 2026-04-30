package com.idlewuxia.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("player_inventory")
public class PlayerInventory {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long playerId;
    private Integer itemId;
    private Integer quantity;
    private Boolean isEquipped;
    private String equippedSlot;

    @TableField(exist = false)
    private Item item;
}
