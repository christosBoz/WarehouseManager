package com.omega.warehousebackend.controller;


import com.omega.warehousebackend.model.InventoryTransaction;
import com.omega.warehousebackend.service.InventoryTransactionService;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class InventoryTransactionController {

    private final InventoryTransactionService service;

    public InventoryTransactionController(InventoryTransactionService service) {
        this.service = service;
    }

    @GetMapping("/item/{itemId}")
    public List<InventoryTransaction> getForItem(@PathVariable Long itemId) {
        return service.getTransactionsForItem(itemId);
    }

    @GetMapping
    public List<InventoryTransaction> getAllItems() {
        return service.getAllTransactions();
    }


    @PostMapping("/{id}/undo")
    public void undoAction(@PathVariable Long id) {
        service.undoTransaction(id);
    }
}
