package com.linkme.backend.module.service;

import com.linkme.backend.module.entity.Post;
import java.util.List;

public interface PostService {
    Post findById(Integer id);
    List<Post> findByUserId(Integer userId);
    List<Post> search(String keyword, int limit, int offset);
    Post create(Post obj);
}
