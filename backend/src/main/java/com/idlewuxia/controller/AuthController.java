package com.idlewuxia.controller;

import com.idlewuxia.dto.LoginDTO;
import com.idlewuxia.dto.RegisterDTO;
import com.idlewuxia.service.PlayerService;
import com.idlewuxia.util.Result;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final PlayerService playerService;

    public AuthController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping("/register")
    public Result<Map<String, Object>> register(@Valid @RequestBody RegisterDTO dto) {
        try {
            return Result.success(playerService.register(dto));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO dto) {
        try {
            return Result.success(playerService.login(dto));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
