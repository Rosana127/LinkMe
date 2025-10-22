package com.linkme.backend.module.mapper;

import com.linkme.backend.module.entity.Follow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FollowMapper {
    Follow findById(@Param("id") Integer id);
    java.util.List<Follow> findByUserId(@Param("userId") Integer userId);
    java.util.List<Follow> search(@Param("keyword") String keyword, @Param("limit") int limit, @Param("offset") int offset);
    int insert(Follow obj);
}
