package com.linkme.backend.module.follow.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Follow {
    private Integer id;
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;
}
