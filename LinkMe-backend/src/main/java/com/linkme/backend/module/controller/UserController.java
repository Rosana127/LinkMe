package com.linkme.backend.module.user.controller;

import com.linkme.backend.common.R;
import com.linkme.backend.module.user.entity.User;
import com.linkme.backend.module.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public R<User> register(@RequestParam String username, @RequestParam String password) {
        User exist = userService.findByUsername(username);
        if (exist != null) {
            return R.fail("username already exists");
        }
        User u = new User();
        u.setUsername(username);
        u.setNickname(username);
        User saved = userService.register(u, password);
        return R.ok(saved);
    }

    @PostMapping("/login")
    public R<String> login(@RequestParam String username, @RequestParam String password) {
        User u = userService.findByUsername(username);
        if (u == null) return R.fail("user not found");
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder enc = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        if (!enc.matches(password, u.getPasswordHash())) {
            return R.fail("invalid credentials");
        }
        String token = com.linkme.backend.common.JwtUtil.generateToken(String.valueOf(u.getUserId()));
        return R.ok(token);
    }

    @GetMapping("/me/{id}")
    public R<User> getMe(@PathVariable Integer id) {
        User u = userService.findById(id);
        if (u == null) return R.fail("user not found");
        return R.ok(u);
    }
}
