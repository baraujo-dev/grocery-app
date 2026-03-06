package io.github.baraujo.grocery.auth;

import io.github.baraujo.grocery.user.UserEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth/health")
@CrossOrigin
public class AuthHealthController {

    @GetMapping
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/secure")
    public Map<String, String> secureHealth(@AuthenticationPrincipal Object principal) {
        if (principal instanceof UserEntity user) {
            return Map.of("status", "ok", "user", user.getUsername());
        }

        return Map.of("status", "ok", "user", "unknown");
    }
}
