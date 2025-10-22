package com.linkme.backend.module.match.mapper;

import com.linkme.backend.module.match.entity.Match;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MatchMapper {
    Match findById(@Param("id") Integer id);
    java.util.List<Match> findByUserId(@Param("userId") Integer userId);
    java.util.List<Match> search(@Param("keyword") String keyword, @Param("limit") int limit, @Param("offset") int offset);
    int insert(Match obj);
}
