package com.linkme.backend.common;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {
    private static final String secret = "change_this_secret_to_a_strong_one_change_this_secret";
    private static final Key key = Keys.hmacShaKeyFor(secret.getBytes());
    private static final long expireSeconds = 86400L;

    public static String generateToken(String subject) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expireSeconds * 1000);
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String parseSubject(String token) {
        if (token == null) return null;
        try {
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return claims.getBody().getSubject();
        } catch (JwtException ex) {
            return null;
        }
    }
}
