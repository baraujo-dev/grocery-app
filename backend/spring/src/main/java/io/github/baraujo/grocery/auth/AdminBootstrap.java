package io.github.baraujo.grocery.auth;

import io.github.baraujo.grocery.user.UserEntity;
import io.github.baraujo.grocery.user.UserRepository;
import io.github.baraujo.grocery.user.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrap {

    @Bean
    public ApplicationRunner adminBootstrapRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${auth.admin.username:}") String adminUsername,
            @Value("${auth.admin.password:}") String adminPassword
    ) {
        return args -> {
            if (adminUsername == null || adminUsername.isBlank()
                    || adminPassword == null || adminPassword.isBlank()) {
                return;
            }

            UserEntity admin = userRepository.findByUsername(adminUsername).orElse(null);
            if (admin == null) {
                admin = new UserEntity(adminUsername, passwordEncoder.encode(adminPassword));
                admin.setRole(UserRole.ADMIN);
                userRepository.save(admin);
            } else {
                boolean changed = false;

                if (admin.getRole() != UserRole.ADMIN) {
                    admin.setRole(UserRole.ADMIN);
                    changed = true;
                }

                if (!passwordEncoder.matches(adminPassword, admin.getPasswordHash())) {
                    admin.setPasswordHash(passwordEncoder.encode(adminPassword));
                    changed = true;
                }

                if (changed) {
                    userRepository.save(admin);
                }
            }
        };
    }
}
