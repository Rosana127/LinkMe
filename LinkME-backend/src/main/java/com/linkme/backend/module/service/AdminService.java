package com.linkme.backend.module.service;

import com.linkme.backend.module.entity.Admin;
import java.util.List;

public interface AdminService {
    Admin findById(Integer id);
    List<Admin> findByUserId(Integer userId);
    List<Admin> search(String keyword, int limit, int offset);
    Admin create(Admin obj);
}
