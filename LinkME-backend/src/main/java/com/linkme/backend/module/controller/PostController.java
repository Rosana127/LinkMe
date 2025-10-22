package com.linkme.backend.module.controller;

import com.linkme.backend.common.R;
import com.linkme.backend.module.entity.Post;
import com.linkme.backend.module.service.PostService;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService service;

    @PostMapping("/create")
    public R<Post> create(HttpServletRequest req, @RequestParam String content) {
        String subject = (String)req.getAttribute("userSubject");
        Integer userId = null;
        try { userId = Integer.valueOf(subject); } catch(Exception e) { userId = 0; }
        Post obj = new Post();
        obj.setUserId(userId);
        obj.setContent(content);
        Post saved = service.create(obj);
        return R.ok(saved);
    }

    @GetMapping("/my")
    public R<List<Post>> my(HttpServletRequest req) {
        String subject = (String)req.getAttribute("userSubject");
        Integer userId = null;
        try { userId = Integer.valueOf(subject); } catch(Exception e) { return R.fail("invalid user"); }
        List<Post> list = service.findByUserId(userId);
        return R.ok(list);
    }

    @GetMapping("/search")
    public R<List<Post>> search(@RequestParam(required=false) String keyword, @RequestParam(defaultValue="10") int limit, @RequestParam(defaultValue="0") int offset) {
        return R.ok(service.search(keyword, limit, offset));
    }
}
