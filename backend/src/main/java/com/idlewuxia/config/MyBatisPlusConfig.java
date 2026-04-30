package com.idlewuxia.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.idlewuxia.mapper")
public class MyBatisPlusConfig {
}
