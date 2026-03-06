package io.github.baraujo.grocery.item;

public class GroceryItemMapper {

    public static GroceryItemDto toDto(GroceryItemEntity entity) {
        return new GroceryItemDto(
                entity.getId(),
                entity.getName(),
                entity.getAddedAt(),
                entity.getCompletedAt(),
                entity.getPosition()
        );
    }

    public static GroceryItemEntity toEntity(CreateItemRequest request) {
        return new GroceryItemEntity(request.name());
    }
}
