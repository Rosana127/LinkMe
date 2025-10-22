package com.linkme.backend.module.match.service;

import com.linkme.backend.module.match.entity.Match;
import java.util.List;

public interface MatchService {
    Match findById(Integer id);
    List<Match> findByUserId(Integer userId);
    List<Match> search(String keyword, int limit, int offset);
    Match create(Match obj);
}
