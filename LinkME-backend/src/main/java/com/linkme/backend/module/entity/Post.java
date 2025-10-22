package com.linkme.backend.module.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Post {
    private Integer id;
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;
}
