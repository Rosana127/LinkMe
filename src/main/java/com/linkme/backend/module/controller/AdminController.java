package com.linkme.backend.module.controller;

import com.linkme.backend.common.R;
import com.linkme.backend.module.admin.entity.Admin;
import com.linkme.backend.module.admin.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService service;

    @PostMapping("/create")
    public R<Admin> create(HttpServletRequest req, @RequestParam String content) {
        String subject = (String)req.getAttribute("userSubject");
        Integer userId = null;
        try { userId = Integer.valueOf(subject); } catch(Exception e) { userId = 0; }
        Admin obj = new Admin();
        obj.setUserId(userId);
        obj.setContent(content);
        Admin saved = service.create(obj);
        return R.ok(saved);
    }

    @GetMapping("/my")
    public R<List<Admin>> my(HttpServletRequest req) {
        String subject = (String)req.getAttribute("userSubject");
        Integer userId = null;
        try { userId = Integer.valueOf(subject); } catch(Exception e) { return R.fail("invalid user"); }
        List<Admin> list = service.findByUserId(userId);
        return R.ok(list);
    }

    @GetMapping("/search")
    public R<List<Admin>> search(@RequestParam(required=false) String keyword, @RequestParam(defaultValue="10") int limit, @RequestParam(defaultValue="0") int offset) {
        return R.ok(service.search(keyword, limit, offset));
    }
}
