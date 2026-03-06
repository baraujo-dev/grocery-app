package io.github.baraujo.grocery.item;

import io.github.baraujo.grocery.list.GroceryListEntity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "grocery_items")
public class GroceryItemEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    private Instant addedAt;

    private Instant completedAt;

    @Column(nullable = false)
    private int position = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grocery_list_id", nullable = false)
    private GroceryListEntity groceryList;

    protected GroceryItemEntity() {}

    public GroceryItemEntity(String name) {
        this.name = name;
        this.addedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public Instant getAddedAt() { return addedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public GroceryListEntity getGroceryList() { return groceryList; }
    public int getPosition() { return position; }

    public void setGroceryList(GroceryListEntity groceryList) {
        this.groceryList = groceryList;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public boolean isCompleted() {
        return completedAt != null;
    }

    public void markCompleted() {
        this.completedAt = Instant.now();
    }

    public void markActive() {
        this.completedAt = null;
    }
}
