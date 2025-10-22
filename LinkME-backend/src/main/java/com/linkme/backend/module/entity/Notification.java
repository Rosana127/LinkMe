package com.linkme.backend.module.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Notification {
    private Integer id;
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;
}
