package io.github.baraujo.grocery.api.dto;

import java.time.Instant;
import java.util.UUID;

public record GroceryListSummaryDto(
        UUID id,
        String name,
        Instant createdAt
) {}
