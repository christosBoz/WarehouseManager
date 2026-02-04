package com.omega.warehousebackend.model;

import java.time.LocalDateTime;

public class InventoryTransaction {
    private Long id;
    private Long itemId;
    private int delta;
    private String reason;
    private LocalDateTime createdAt;



    public InventoryTransaction() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long item_id) {
        this.itemId = item_id;
    }

    public int getDelta() {
        return delta;
    }

    public void setDelta(int delta) {
        this.delta = delta;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
