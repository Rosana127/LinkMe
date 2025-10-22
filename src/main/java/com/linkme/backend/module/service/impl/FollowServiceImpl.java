package com.linkme.backend.module.follow.service.impl;

import com.linkme.backend.module.follow.entity.Follow;
import com.linkme.backend.module.follow.mapper.FollowMapper;
import com.linkme.backend.module.follow.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowMapper mapper;

    @Override
    public Follow findById(Integer id) {
        return mapper.findById(id);
    }

    @Override
    public List<Follow> findByUserId(Integer userId) {
        return mapper.findByUserId(userId);
    }

    @Override
    public List<Follow> search(String keyword, int limit, int offset) {
        return mapper.search(keyword, limit, offset);
    }

    @Override
    public Follow create(Follow obj) {
        mapper.insert(obj);
        return obj;
    }
}
