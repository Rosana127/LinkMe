package com.linkme.backend.module.follow.service;

import com.linkme.backend.module.follow.entity.Follow;
import java.util.List;

public interface FollowService {
    Follow findById(Integer id);
    List<Follow> findByUserId(Integer userId);
    List<Follow> search(String keyword, int limit, int offset);
    Follow create(Follow obj);
}
