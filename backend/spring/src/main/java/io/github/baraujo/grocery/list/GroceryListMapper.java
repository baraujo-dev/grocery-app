package io.github.baraujo.grocery.list;

import io.github.baraujo.grocery.api.dto.GroceryListDetailDto;
import io.github.baraujo.grocery.api.dto.GroceryListSummaryDto;
import io.github.baraujo.grocery.item.GroceryItemMapper;

public class GroceryListMapper {

    public static GroceryListSummaryDto toSummaryDto(GroceryListEntity entity) {
        return new GroceryListSummaryDto(
                entity.getId(),
                entity.getName(),
                entity.getCreatedAt()
        );
    }

    public static GroceryListDetailDto toDetailDto(GroceryListEntity entity) {
        return new GroceryListDetailDto(
                entity.getId(),
                entity.getName(),
                entity.getCreatedAt(),
                entity.getItems()
                        .stream()
                        .map(GroceryItemMapper::toDto)
                        .toList()
        );
    }
}
