package com.linkme.backend.module.admin.mapper;

import com.linkme.backend.module.admin.entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminMapper {
    Admin findById(@Param("id") Integer id);
    java.util.List<Admin> findByUserId(@Param("userId") Integer userId);
    java.util.List<Admin> search(@Param("keyword") String keyword, @Param("limit") int limit, @Param("offset") int offset);
    int insert(Admin obj);
}
