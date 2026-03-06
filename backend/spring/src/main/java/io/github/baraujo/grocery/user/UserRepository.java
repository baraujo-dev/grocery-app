package io.github.baraujo.grocery.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByRefreshTokenHash(String refreshTokenHash);

    boolean existsByUsername(String username);
}
