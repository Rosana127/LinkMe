package com.linkme.backend.module.mapper;

import com.linkme.backend.module.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PostMapper {
    Post findById(@Param("id") Integer id);
    java.util.List<Post> findByUserId(@Param("userId") Integer userId);
    java.util.List<Post> search(@Param("keyword") String keyword, @Param("limit") int limit, @Param("offset") int offset);
    int insert(Post obj);
}
