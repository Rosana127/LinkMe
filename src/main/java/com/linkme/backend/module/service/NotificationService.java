package com.linkme.backend.module.notification.service;

import com.linkme.backend.module.notification.entity.Notification;
import java.util.List;

public interface NotificationService {
    Notification findById(Integer id);
    List<Notification> findByUserId(Integer userId);
    List<Notification> search(String keyword, int limit, int offset);
    Notification create(Notification obj);
}
