package com.linkme.backend.module.notification.mapper;

import com.linkme.backend.module.notification.entity.Notification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NotificationMapper {
    Notification findById(@Param("id") Integer id);
    java.util.List<Notification> findByUserId(@Param("userId") Integer userId);
    java.util.List<Notification> search(@Param("keyword") String keyword, @Param("limit") int limit, @Param("offset") int offset);
    int insert(Notification obj);
}
