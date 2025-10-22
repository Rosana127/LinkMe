package com.linkme.backend.module.user.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Integer userId;
    private String username;
    private String email;
    private String phone;
    private String passwordHash;
    private String nickname;
    private String gender;
    private LocalDateTime createdAt;
}
