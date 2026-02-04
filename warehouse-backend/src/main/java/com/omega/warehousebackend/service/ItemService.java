package com.omega.warehousebackend.service;

import com.omega.warehousebackend.model.Item;
import com.omega.warehousebackend.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final LocationService locationService;

    public ItemService(ItemRepository itemRepository, LocationService locationService) {
        this.itemRepository = itemRepository;
        this.locationService = locationService;
    }


    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public void createItem(Item item) {
//        System.out.println(item.getLocationId());
        validateItem(item);
        itemRepository.save(item);
    }

    public void updateItem(Long id, Item item) {
//we do existing item because if the id doesn't exist then we can call error message.
        Item existing = itemRepository.findById(id);
//        do this to force correct id just in case a bug gives us the wrong id.
        item.setId(existing.getId());
        validateItem(item);
        itemRepository.update(item);
    }

    public void dropItem(Long id) {
        Item existing = itemRepository.findById(id);
        itemRepository.delete(existing);
    }

    public List<Item> fetchRecentItems(int count) {
        int safeLimit = Math.min(count, 10);
        return itemRepository.findRecentItemsDesc(safeLimit);
    }


    private void validateItem(Item item) {
        if (item.getName() == null || item.getName().isBlank()) {
            throw new IllegalArgumentException("Item name is a required field");
        }
        if (item.getQuantity() < 0) {
            throw new IllegalArgumentException("Item quantity cant be negative");
        }
        if (item.getLocationId() == null) {
            throw new IllegalArgumentException("Item location is a required field");
        }
        if (item.getStatus() == null) {
            throw new IllegalArgumentException("Item status is a required field");
        }
        if (!locationService.locationExists(item.getLocationId())) {
            throw new IllegalArgumentException("Invalid Shelf number");
        }
    }


}
