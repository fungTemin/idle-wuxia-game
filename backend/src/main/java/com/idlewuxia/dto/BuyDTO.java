package com.idlewuxia.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BuyDTO {
    @NotNull(message = "商品ID不能为空")
    private Integer shopItemId;

    @Min(value = 1, message = "购买数量至少为1")
    private Integer quantity = 1;
}
