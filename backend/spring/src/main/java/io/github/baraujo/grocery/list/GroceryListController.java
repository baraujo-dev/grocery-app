package io.github.baraujo.grocery.list;

import io.github.baraujo.grocery.api.dto.GroceryListDetailDto;
import io.github.baraujo.grocery.api.dto.GroceryListSummaryDto;
import io.github.baraujo.grocery.item.CreateItemRequest;
import io.github.baraujo.grocery.item.GroceryItemDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lists")
public class GroceryListController {

    private final GroceryListService listService;

    public GroceryListController(GroceryListService listService) {
        this.listService = listService;
    }

    @GetMapping
    public List<GroceryListSummaryDto> getLists() {
        return listService.getLists();
    }

    @GetMapping("/{id}")
    public GroceryListDetailDto getList(@PathVariable UUID id) {
        return listService.getList(id);
    }

    @PostMapping
    public GroceryListSummaryDto createList(@RequestBody CreateListRequest request) {
        return listService.createList(request.name());
    }

    @PostMapping("/{id}")
    public GroceryItemDto addItem(@PathVariable UUID id, @RequestBody CreateItemRequest request) {
        return listService.addItem(id, request.name());
    }

    @PatchMapping("/{id}/items/order")
    public void reorderItems(@PathVariable UUID id, @RequestBody List<UUID> orderedItemIds) {
        listService.reorderItems(id, orderedItemIds);
    }

    @PostMapping("/{id}/share")
    public void shareList(@PathVariable UUID id, @RequestBody ShareListRequest request) {
        listService.shareList(id, request.username());
    }

    @PostMapping("/{id}/unshare")
    public void unshareList(@PathVariable UUID id, @RequestBody ShareListRequest request) {
        listService.unshareList(id, request.username());
    }

    @GetMapping("/{id}/shared")
    public List<String> getSharedUsers(@PathVariable UUID id) {
        return listService.getSharedUsernames(id);
    }

    @DeleteMapping("/{id}")
    public void deleteList(@PathVariable UUID id) {
        listService.deleteList(id);
    }
}
