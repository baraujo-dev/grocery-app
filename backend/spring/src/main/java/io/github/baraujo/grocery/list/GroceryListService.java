package io.github.baraujo.grocery.list;

import io.github.baraujo.grocery.api.dto.GroceryListDetailDto;
import io.github.baraujo.grocery.api.dto.GroceryListSummaryDto;
import io.github.baraujo.grocery.item.GroceryItemDto;
import io.github.baraujo.grocery.item.GroceryItemEntity;
import io.github.baraujo.grocery.item.GroceryItemMapper;
import io.github.baraujo.grocery.user.UserEntity;
import io.github.baraujo.grocery.user.UserRepository;
import io.github.baraujo.grocery.user.UserRole;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class GroceryListService {

    private final GroceryListRepository listRepo;
    private final UserRepository userRepository;

    public GroceryListService(GroceryListRepository listRepo, UserRepository userRepository) {
        this.listRepo = listRepo;
        this.userRepository = userRepository;
    }

    public List<GroceryListSummaryDto> getLists() {
        UserEntity owner = getCurrentUser();
        List<GroceryListEntity> lists = isAdmin(owner)
                ? listRepo.findAll()
                : listRepo.findDistinctByOwnerOrSharedUsersContains(owner, owner);
        return lists
                .stream()
                .map(GroceryListMapper::toSummaryDto)
                .toList();
    }

    public GroceryListDetailDto getList(UUID id) {
        UserEntity owner = getCurrentUser();
        GroceryListEntity list = listRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!canAccessList(owner, list)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return GroceryListMapper.toDetailDto(list);
    }

    public GroceryListSummaryDto createList(String name) {
        UserEntity owner = getCurrentUser();
        GroceryListEntity list = new GroceryListEntity(name);
        list.setOwner(owner);
        GroceryListEntity saved = listRepo.save(list);

        return GroceryListMapper.toSummaryDto(saved);
    }

    public GroceryItemDto addItem(UUID listId, String itemName) {
        UserEntity owner = getCurrentUser();
        GroceryListEntity list = listRepo.findById(listId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!canAccessList(owner, list)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        GroceryItemEntity item = new GroceryItemEntity(itemName);
        int nextPosition = list.getItems().stream()
                .mapToInt(GroceryItemEntity::getPosition)
                .max()
                .orElse(-1) + 1;
        item.setPosition(nextPosition);
        list.addItem(item);

        listRepo.save(list); // cascade saves item
        return GroceryItemMapper.toDto(item);
    }

    public void deleteList(UUID id) {
        UserEntity owner = getCurrentUser();
        GroceryListEntity list = listRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!canAccessList(owner, list)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        listRepo.delete(list);
    }

    public void reorderItems(UUID listId, List<UUID> orderedItemIds) {
        UserEntity owner = getCurrentUser();
        GroceryListEntity list = listRepo.findById(listId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!canAccessList(owner, list)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Map<UUID, GroceryItemEntity> itemsById = list.getItems().stream()
                .collect(Collectors.toMap(GroceryItemEntity::getId, Function.identity()));

        Set<UUID> assigned = new HashSet<>();
        int position = 0;

        for (UUID id : orderedItemIds) {
            GroceryItemEntity item = itemsById.get(id);
            if (item == null) {
                continue;
            }
            item.setPosition(position++);
            assigned.add(id);
        }

        final int[] nextPosition = { position };
        list.getItems().stream()
                .filter(item -> !assigned.contains(item.getId()))
                .sorted(Comparator.comparingInt(GroceryItemEntity::getPosition))
                .forEach(item -> item.setPosition(nextPosition[0]++));

        listRepo.save(list);
    }

    public void shareList(UUID listId, String username) {
        UserEntity owner = getCurrentUser();
        GroceryListEntity list = listRepo.findById(listId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!isAdmin(owner) && !list.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        String normalized = normalizeEmail(username);
        if (!isValidEmail(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must be a valid email");
        }
        UserEntity user = userRepository.findByUsername(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (list.getOwner().getId().equals(user.getId())) {
            return;
        }
        list.addSharedUser(user);
        listRepo.save(list);
    }

    public void unshareList(UUID listId, String username) {
        UserEntity owner = getCurrentUser();
        GroceryListEntity list = listRepo.findById(listId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!isAdmin(owner) && !list.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        String normalized = normalizeEmail(username);
        if (!isValidEmail(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must be a valid email");
        }
        UserEntity user = userRepository.findByUsername(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (list.getOwner().getId().equals(user.getId())) {
            return;
        }
        list.removeSharedUser(user);
        listRepo.save(list);
    }

    public List<String> getSharedUsernames(UUID listId) {
        UserEntity requester = getCurrentUser();
        GroceryListEntity list = listRepo.findById(listId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!canAccessList(requester, list)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return list.getSharedUsers()
                .stream()
                .map(UserEntity::getUsername)
                .sorted()
                .toList();
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
