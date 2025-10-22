package com.linkme.backend.module.match.service.impl;

import com.linkme.backend.module.match.entity.Match;
import com.linkme.backend.module.match.mapper.MatchMapper;
import com.linkme.backend.module.match.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchServiceImpl implements MatchService {

    @Autowired
    private MatchMapper mapper;

    @Override
    public Match findById(Integer id) {
        return mapper.findById(id);
    }

    @Override
    public List<Match> findByUserId(Integer userId) {
        return mapper.findByUserId(userId);
    }

    @Override
    public List<Match> search(String keyword, int limit, int offset) {
        return mapper.search(keyword, limit, offset);
    }

    @Override
    public Match create(Match obj) {
        mapper.insert(obj);
        return obj;
    }
}
