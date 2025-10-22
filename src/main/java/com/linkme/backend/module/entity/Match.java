package com.linkme.backend.module.match.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Match {
    private Integer id;
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;
}
