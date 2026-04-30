package com.idlewuxia.controller;

import com.idlewuxia.util.Result;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;

@RestController
@RequestMapping("/api/init")
public class InitController {

    private final DataSource dataSource;

    public InitController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostMapping("/schema")
    public Result<String> initSchema() {
        try {
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource("db/schema.sql"));
            populator.setContinueOnError(false);
            populator.execute(dataSource);
            return Result.success("数据库初始化成功");
        } catch (Exception e) {
            return Result.error("初始化失败: " + e.getMessage());
        }
    }
}
