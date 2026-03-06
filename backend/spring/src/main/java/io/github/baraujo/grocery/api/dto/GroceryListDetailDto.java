package io.github.baraujo.grocery.api.dto;

import io.github.baraujo.grocery.item.GroceryItemDto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GroceryListDetailDto(
        UUID id,
        String name,
        Instant createdAt,
        List<GroceryItemDto> items
) {}
