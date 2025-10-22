package com.linkme.backend.module.post.service.impl;

import com.linkme.backend.module.post.entity.Post;
import com.linkme.backend.module.post.mapper.PostMapper;
import com.linkme.backend.module.post.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostMapper mapper;

    @Override
    public Post findById(Integer id) {
        return mapper.findById(id);
    }

    @Override
    public List<Post> findByUserId(Integer userId) {
        return mapper.findByUserId(userId);
    }

    @Override
    public List<Post> search(String keyword, int limit, int offset) {
        return mapper.search(keyword, limit, offset);
    }

    @Override
    public Post create(Post obj) {
        mapper.insert(obj);
        return obj;
    }
}
