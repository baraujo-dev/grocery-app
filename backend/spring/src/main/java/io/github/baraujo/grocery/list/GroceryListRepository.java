package io.github.baraujo.grocery.list;

import io.github.baraujo.grocery.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GroceryListRepository
        extends JpaRepository<GroceryListEntity, UUID> {
    List<GroceryListEntity> findDistinctByOwnerOrSharedUsersContains(UserEntity owner, UserEntity sharedUser);
}
