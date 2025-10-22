package com.linkme.backend.module.service;

import com.linkme.backend.module.entity.User;

public interface UserService {
    User findById(Integer id);
    User findByUsername(String username);
    User register(User user, String rawPassword);
}
