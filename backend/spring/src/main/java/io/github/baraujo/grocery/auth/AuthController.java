package io.github.baraujo.grocery.auth;

import io.github.baraujo.grocery.user.UserEntity;
import io.github.baraujo.grocery.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider,
            RefreshTokenService refreshTokenService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody Map<String, String> request,
            HttpServletResponse response
    ) {
        String username = normalizeEmail(request.get("username"));
        String password = request.get("password");
        if (!isValidEmail(username)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must be a valid email");
        }

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        String token = jwtProvider.generateToken(user.getId(), user.getUsername());
        String refreshToken = refreshTokenService.issueRefreshToken(user);
        setRefreshCookie(response, refreshToken, refreshTokenService.getRefreshTokenTtlSeconds());
        return Map.of("token", token);
    }

    @PostMapping("/login-mobile")
    public Map<String, String> loginMobile(@RequestBody Map<String, String> request) {
        String username = normalizeEmail(request.get("username"));
        String password = request.get("password");
        if (!isValidEmail(username)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must be a valid email");
        }

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        String token = jwtProvider.generateToken(user.getId(), user.getUsername());
        String refreshToken = refreshTokenService.issueRefreshToken(user);
        return Map.of(
                "token", token,
                "refreshToken", refreshToken
        );
    }

    @PostMapping("/refresh")
    public Map<String, String> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshToken(request, true);

        String refreshTokenHash = refreshTokenService.hashToken(refreshToken);
        UserEntity user = userRepository.findByRefreshTokenHash(refreshTokenHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (!refreshTokenService.isRefreshTokenValid(user, refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        String token = jwtProvider.generateToken(user.getId(), user.getUsername());
        String newRefreshToken = refreshTokenService.issueRefreshToken(user);
        setRefreshCookie(response, newRefreshToken, refreshTokenService.getRefreshTokenTtlSeconds());
        return Map.of("token", token);
    }

    @PostMapping("/refresh-mobile")
    public Map<String, String> refreshMobile(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
        }

        String refreshTokenHash = refreshTokenService.hashToken(refreshToken);
        UserEntity user = userRepository.findByRefreshTokenHash(refreshTokenHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (!refreshTokenService.isRefreshTokenValid(user, refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        String token = jwtProvider.generateToken(user.getId(), user.getUsername());
        String newRefreshToken = refreshTokenService.issueRefreshToken(user);
        return Map.of(
                "token", token,
                "refreshToken", newRefreshToken
        );
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshToken(request, false);
        if (refreshToken != null && !refreshToken.isBlank()) {
            String refreshTokenHash = refreshTokenService.hashToken(refreshToken);
            userRepository.findByRefreshTokenHash(refreshTokenHash)
                    .ifPresent(refreshTokenService::clearRefreshToken);
        }
        clearRefreshCookie(response);
    }

    @PostMapping("/logout-mobile")
    public void logoutMobile(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }
        String refreshTokenHash = refreshTokenService.hashToken(refreshToken);
        userRepository.findByRefreshTokenHash(refreshTokenHash)
                .ifPresent(refreshTokenService::clearRefreshToken);
    }

    @PostMapping("/register")
    public void register(@RequestBody Map<String, String> request) {
        String username = normalizeEmail(request.get("username"));
        String password = request.get("password");

        if (!isValidEmail(username)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must be a valid email");
        }

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        String hash = passwordEncoder.encode(password);
        userRepository.save(new UserEntity(username, hash));
    }

    private String extractRefreshToken(HttpServletRequest request, boolean required) {
        if (request.getCookies() == null) {
            if (required) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
            }
            return null;
        }
        for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        if (required) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
        }
        return null;
    }

    private void setRefreshCookie(HttpServletResponse response, String token, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Strict")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    private boolean isValidEmail(String username) {
        if (username == null) {
            return false;
        }
        return username.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    private String normalizeEmail(String username) {
        if (username == null) {
            return null;
        }
        return username.trim().toLowerCase();
    }

}
