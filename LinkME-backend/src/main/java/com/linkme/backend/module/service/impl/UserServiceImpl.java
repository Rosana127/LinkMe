package com.linkme.backend.module.service.impl;

import com.linkme.backend.module.entity.User;
import com.linkme.backend.module.mapper.UserMapper;
import com.linkme.backend.module.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public User findById(Integer id) {
        return userMapper.findById(id);
    }

    @Override
    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    @Override
    public User register(User user, String rawPassword) {
        String hashed = passwordEncoder.encode(rawPassword);
        user.setPasswordHash(hashed);
        userMapper.insert(user);
        return user;
    }
}
