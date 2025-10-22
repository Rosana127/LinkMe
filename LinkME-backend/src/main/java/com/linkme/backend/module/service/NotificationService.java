package com.linkme.backend.module.service;

import com.linkme.backend.module.entity.Notification;
import java.util.List;

public interface NotificationService {
    Notification findById(Integer id);
    List<Notification> findByUserId(Integer userId);
    List<Notification> search(String keyword, int limit, int offset);
    Notification create(Notification obj);
}
