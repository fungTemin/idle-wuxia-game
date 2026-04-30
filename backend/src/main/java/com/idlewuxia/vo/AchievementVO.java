package com.idlewuxia.vo;

import lombok.Data;

@Data
public class AchievementVO {
    private Integer id;
    private String name;
    private String description;
    private String type;
    private Integer targetValue;
    private Integer currentValue;
    private Boolean isCompleted;
    private Boolean isRewarded;
    private String rewardType;
    private Integer rewardValue;
    private Double progress;
}
