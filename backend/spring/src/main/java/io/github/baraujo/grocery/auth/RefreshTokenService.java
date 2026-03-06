package io.github.baraujo.grocery.auth;

import io.github.baraujo.grocery.user.UserEntity;
import io.github.baraujo.grocery.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

@Service
public class RefreshTokenService {

    private final Duration refreshTokenTtl;
    private final SecureRandom secureRandom = new SecureRandom();
    private final UserRepository userRepository;

    public RefreshTokenService(
            UserRepository userRepository,
            @Value("${auth.refresh-token.ttl-days:7}") long refreshTokenTtlDays
    ) {
        this.userRepository = userRepository;
        this.refreshTokenTtl = Duration.ofDays(refreshTokenTtlDays);
    }

    public String issueRefreshToken(UserEntity user) {
        String token = generateToken();
        user.setRefreshTokenHash(hashToken(token));
        user.setRefreshTokenExpiresAt(Instant.now().plus(refreshTokenTtl));
        userRepository.save(user);
        return token;
    }

    public boolean isRefreshTokenValid(UserEntity user, String token) {
        if (user.getRefreshTokenHash() == null || user.getRefreshTokenExpiresAt() == null) {
            return false;
        }

        if (user.getRefreshTokenExpiresAt().isBefore(Instant.now())) {
            return false;
        }

        return user.getRefreshTokenHash().equals(hashToken(token));
    }

    public long getRefreshTokenTtlSeconds() {
        return refreshTokenTtl.getSeconds();
    }

    public void clearRefreshToken(UserEntity user) {
        user.setRefreshTokenHash(null);
        user.setRefreshTokenExpiresAt(null);
        userRepository.save(user);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
