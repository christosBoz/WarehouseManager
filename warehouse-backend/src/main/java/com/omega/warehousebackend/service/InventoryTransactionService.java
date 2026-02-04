package com.omega.warehousebackend.service;

import com.omega.warehousebackend.model.InventoryTransaction;
import com.omega.warehousebackend.model.Item;
import com.omega.warehousebackend.repository.InventoryTransactionRepository;
import com.omega.warehousebackend.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;
    private final ItemRepository itemRepository;

    public InventoryTransactionService(
            InventoryTransactionRepository transactionRepository,
            ItemRepository itemRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.itemRepository = itemRepository;
    }


    @Transactional
    public void adjustInventory(Long itemId, int delta, String reason) {
        Item item = itemRepository.findById(itemId);

        if (item == null) {
            throw new IllegalArgumentException("Item not found");
        }
        int newQuantity = item.getQuantity() + delta;
        System.out.println(newQuantity);

        if (newQuantity < 0) {
            throw new IllegalArgumentException("Insufficient Inventory");
        }

        itemRepository.updateQuantity(itemId, newQuantity);

        transactionRepository.createTransaction(itemId, delta, reason);
    }

    public List<InventoryTransaction> getTransactionsForItem(Long itemId) {
        return transactionRepository.findByItemId(itemId);
    }

    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Transactional
    public void undoTransaction(Long transactionId) {
        InventoryTransaction tx = transactionRepository.findById(transactionId);

        Item item = itemRepository.findById(tx.getItemId());

        int newQty = item.getQuantity() - tx.getDelta();
        if (newQty < 0) {
            throw new IllegalStateException("Undo would result in negative stock");
        }

        itemRepository.updateQuantity(item.getId(), newQty);

        transactionRepository.createTransaction(
                item.getId(),
                -tx.getDelta(),
                "Undo: " + tx.getReason()
        );
    }






}
