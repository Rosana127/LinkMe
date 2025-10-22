package com.linkme.backend.module.controller;

import com.linkme.backend.common.R;
import com.linkme.backend.module.entity.Match;
import com.linkme.backend.module.service.MatchService;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match")
public class MatchController {

    @Autowired
    private MatchService service;

    @PostMapping("/create")
    public R<Match> create(HttpServletRequest req, @RequestParam String content) {
        String subject = (String)req.getAttribute("userSubject");
        Integer userId = null;
        try { userId = Integer.valueOf(subject); } catch(Exception e) { userId = 0; }
        Match obj = new Match();
        obj.setUserId(userId);
        obj.setContent(content);
        Match saved = service.create(obj);
        return R.ok(saved);
    }

    @GetMapping("/my")
    public R<List<Match>> my(HttpServletRequest req) {
        String subject = (String)req.getAttribute("userSubject");
        Integer userId = null;
        try { userId = Integer.valueOf(subject); } catch(Exception e) { return R.fail("invalid user"); }
        List<Match> list = service.findByUserId(userId);
        return R.ok(list);
    }

    @GetMapping("/search")
    public R<List<Match>> search(@RequestParam(required=false) String keyword, @RequestParam(defaultValue="10") int limit, @RequestParam(defaultValue="0") int offset) {
        return R.ok(service.search(keyword, limit, offset));
    }
}
