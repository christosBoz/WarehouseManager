package com.omega.warehousebackend.controller;

import com.omega.warehousebackend.dto.AdjustInventoryRequest;
import com.omega.warehousebackend.model.Item;
import com.omega.warehousebackend.repository.ItemRepository;
import com.omega.warehousebackend.service.InventoryTransactionService;
import com.omega.warehousebackend.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final InventoryTransactionService transactionService;
    private final ItemRepository itemRepository;

    public ItemController(ItemService itemService, InventoryTransactionService transactionService, ItemRepository itemRepository) {
        this.itemService = itemService;
        this.transactionService = transactionService;
        this.itemRepository = itemRepository;
    }

    // ------------------------
    // GET all items
    // ------------------------
    @GetMapping
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    // ------------------------
    // GET item by id
    // ------------------------
    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    // ------------------------
    // CREATE item
    // ------------------------
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createItem(@RequestBody Item item) {
        itemService.createItem(item);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateItem(@PathVariable Long id, @RequestBody Item item) {
        itemService.updateItem(id, item);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long id) {
        itemService.dropItem(id);
    }


    @PostMapping("/{id}/adjust")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void adjustInventory(@PathVariable Long id, @RequestBody AdjustInventoryRequest request) {
        if (request.getReason() == null || request.getReason().isBlank()) {
            throw new IllegalArgumentException("Reason is required");
        }
        transactionService.adjustInventory(id, request.getDelta(), request.getReason());
    }

    @GetMapping("/recent")
    public List<Item> getRecentItems(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return itemService.fetchRecentItems(limit);
    }
}
