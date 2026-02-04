package com.omega.warehousebackend.model;

import java.time.LocalDateTime;

public class Item {
    private Long id;
    private String name;
    private String description;
    private int quantity;
    private String imagePath;
    private Long locationId;
    private ItemStatus status;
    private LocalDateTime createdAt;



    public Item() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
    public int getQuantity() {
        return quantity;
    }
    public String getImagePath() {
        return imagePath;
    }

    public Long getLocationId() {
        return locationId;
    }
    public ItemStatus getStatus() {
        return status;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long newId) {
        this.id = newId;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    public void setLocationId(Long location_id) {
        this.locationId = location_id;
    }
    public void setItemStatus(ItemStatus status) {
        this.status = status;
    }
    public void setCreatedAt(LocalDateTime time) {
        this.createdAt = time;
    }



}
