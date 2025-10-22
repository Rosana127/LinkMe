package com.linkme.backend.module.mapper;

import com.linkme.backend.module.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    User findById(@Param("id") Integer id);
    User findByUsername(@Param("username") String username);
    int insert(User user);
}
