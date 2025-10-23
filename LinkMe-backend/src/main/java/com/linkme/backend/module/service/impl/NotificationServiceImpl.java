package com.linkme.backend.module.notification.service.impl;

import com.linkme.backend.module.notification.entity.Notification;
import com.linkme.backend.module.notification.mapper.NotificationMapper;
import com.linkme.backend.module.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationMapper mapper;

    @Override
    public Notification findById(Integer id) {
        return mapper.findById(id);
    }

    @Override
    public List<Notification> findByUserId(Integer userId) {
        return mapper.findByUserId(userId);
    }

    @Override
    public List<Notification> search(String keyword, int limit, int offset) {
        return mapper.search(keyword, limit, offset);
    }

    @Override
    public Notification create(Notification obj) {
        mapper.insert(obj);
        return obj;
    }
}
