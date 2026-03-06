package io.github.baraujo.grocery.list;

import io.github.baraujo.grocery.item.GroceryItemEntity;
import io.github.baraujo.grocery.user.UserEntity;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "grocery_lists")
public class GroceryListEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    private Instant createdAt;

    @ManyToOne(optional = true)
    //@ManyToOne(optional = false) // TODO
    private UserEntity owner;

    @OneToMany(
            mappedBy = "groceryList",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("position ASC, addedAt ASC")
    private List<GroceryItemEntity> items = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "grocery_list_shared_users",
            joinColumns = @JoinColumn(name = "grocery_list_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<UserEntity> sharedUsers = new HashSet<>();

    protected GroceryListEntity() {}

    public GroceryListEntity(String name) {
        this.name = name;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public Instant getCreatedAt() { return createdAt; }
    public List<GroceryItemEntity> getItems() { return items; }
    public Set<UserEntity> getSharedUsers() { return sharedUsers; }

    public void addItem(GroceryItemEntity item) {
        items.add(item);
        item.setGroceryList(this);
    }

    public void removeItem(GroceryItemEntity item) {
        items.remove(item);
        item.setGroceryList(null);
    }

    public UserEntity getOwner() {
        return owner;
    }

    public void setOwner(UserEntity owner) {
        this.owner = owner;
    }

    public void addSharedUser(UserEntity user) {
        sharedUsers.add(user);
    }

    public void removeSharedUser(UserEntity user) {
        sharedUsers.remove(user);
    }
}
