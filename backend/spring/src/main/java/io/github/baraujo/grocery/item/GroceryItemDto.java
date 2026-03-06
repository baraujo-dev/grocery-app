package io.github.baraujo.grocery.item;

import java.time.Instant;
import java.util.UUID;

public record GroceryItemDto(
        UUID id,
        String name,
        Instant addedAt,
        Instant completedAt,
        int position
) {}
