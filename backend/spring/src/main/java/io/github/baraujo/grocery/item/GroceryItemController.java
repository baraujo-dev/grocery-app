package io.github.baraujo.grocery.item;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/items")
public class GroceryItemController {

    private final GroceryItemService service;

    public GroceryItemController(GroceryItemService service) {
        this.service = service;
    }

    @PostMapping("/{id}/toggle")
    public void toggle(@PathVariable UUID id) {
        service.toggle(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    @PostMapping("/delete")
    public void deleteMany(@RequestBody java.util.List<java.util.UUID> ids) {
        service.deleteMany(ids);
    }

}
