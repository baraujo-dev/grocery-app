package io.github.baraujo.grocery.item;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GroceryItemRepository extends JpaRepository<GroceryItemEntity, UUID> {

    List<GroceryItemEntity> findByCompletedAtIsNotNullOrderByCompletedAtDesc();
    List<GroceryItemEntity> findByGroceryListId(UUID groceryListId);
}
