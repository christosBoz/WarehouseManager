package com.omega.warehousebackend.model;

public class Location {
    private Long id;
    private Integer shelf;

    public Location() {}

    public Location(Long id, Integer shelf) {
        this.id = id;
        this.shelf = shelf;
    }



    public Long getId() {
        return id;
    }

    public Integer getShelf() {
        return shelf;
    }

    public void setId(Long newId) {
        this.id = newId;
    }

    public void setShelf(Integer newShelf) {
        this.shelf = newShelf;
    }
}
