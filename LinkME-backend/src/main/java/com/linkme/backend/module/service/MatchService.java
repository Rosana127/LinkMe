package com.linkme.backend.module.service;

import com.linkme.backend.module.entity.Match;
import java.util.List;

public interface MatchService {
    Match findById(Integer id);
    List<Match> findByUserId(Integer userId);
    List<Match> search(String keyword, int limit, int offset);
    Match create(Match obj);
}
