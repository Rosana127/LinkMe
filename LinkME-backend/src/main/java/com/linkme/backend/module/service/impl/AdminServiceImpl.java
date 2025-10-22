package com.linkme.backend.module.service.impl;

import com.linkme.backend.module.entity.Admin;
import com.linkme.backend.module.mapper.AdminMapper;
import com.linkme.backend.module.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper mapper;

    @Override
    public Admin findById(Integer id) {
        return mapper.findById(id);
    }

    @Override
    public List<Admin> findByUserId(Integer userId) {
        return mapper.findByUserId(userId);
    }

    @Override
    public List<Admin> search(String keyword, int limit, int offset) {
        return mapper.search(keyword, limit, offset);
    }

    @Override
    public Admin create(Admin obj) {
        mapper.insert(obj);
        return obj;
    }
}
