package io.github.baraujo.grocery.item;

import io.github.baraujo.grocery.list.GroceryListEntity;
import io.github.baraujo.grocery.user.UserEntity;
import io.github.baraujo.grocery.user.UserRole;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class GroceryItemService {

    private final GroceryItemRepository repository;

    public GroceryItemService(GroceryItemRepository repository) {
        this.repository = repository;
    }


    public void toggle(UUID id) {
        UserEntity owner = getCurrentUser();
        GroceryItemEntity item = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!canAccessList(owner, item.getGroceryList())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        if (item.isCompleted()) {
            item.markActive();
        } else {
            item.markCompleted();
        }

        repository.save(item);
    }

    public void delete(UUID id) {
        UserEntity owner = getCurrentUser();
        GroceryItemEntity item = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!canAccessList(owner, item.getGroceryList())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.delete(item);
    }

    public void deleteMany(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        UserEntity owner = getCurrentUser();
        List<GroceryItemEntity> items = repository.findAllById(ids);
        if (items.size() != ids.size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        for (GroceryItemEntity item : items) {
            if (!canAccessList(owner, item.getGroceryList())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        }
        repository.deleteAll(items);
    }

    private UserEntity getCurrentUser() {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        if (principal instanceof UserEntity user) {
            return user;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    private boolean isAdmin(UserEntity user) {
        return user.getRole() == UserRole.ADMIN;
    }

    private boolean canAccessList(UserEntity user, GroceryListEntity list) {
        if (isAdmin(user)) {
            return true;
        }
        if (list.getOwner() != null && list.getOwner().getId().equals(user.getId())) {
            return true;
        }
        return list.getSharedUsers().stream()
                .anyMatch(shared -> shared.getId().equals(user.getId()));
    }

}
