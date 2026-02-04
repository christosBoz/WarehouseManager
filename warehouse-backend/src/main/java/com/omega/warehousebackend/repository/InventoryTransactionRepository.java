package com.omega.warehousebackend.repository;


import com.omega.warehousebackend.model.InventoryTransaction;
import com.omega.warehousebackend.model.Item;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class InventoryTransactionRepository {

    private final JdbcTemplate jdbcTemplate;
    public InventoryTransactionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<InventoryTransaction> InventoryTransactionRowMapper = new RowMapper<InventoryTransaction>() {
        @Override
        public InventoryTransaction mapRow(ResultSet rs, int rowNum) throws SQLException {
            InventoryTransaction transaction = new InventoryTransaction();
            transaction.setId(rs.getLong("id"));
            transaction.setItemId(rs.getLong("item_id"));
            transaction.setDelta(rs.getInt("delta"));
            transaction.setReason(rs.getString("reason"));
            transaction.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            return transaction;
        }
    };

    public List<InventoryTransaction> findAll() {
        String sql = "SELECT * FROM inventory_transaction";
        return jdbcTemplate.query(sql, InventoryTransactionRowMapper);
    }

    public List<InventoryTransaction> findByItemId(Long itemId) {
        String sql = """
        SELECT id, item_id, delta, reason, created_at
        FROM inventory_transaction
        WHERE item_id = ?
        ORDER BY created_at DESC
    """;

        return jdbcTemplate.query(sql, InventoryTransactionRowMapper, itemId);
    }

    public void createTransaction(Long itemId, int delta, String reason) {
        String sql = """
        INSERT INTO inventory_transaction (item_id, delta, reason)
        VALUES (?, ?, ?)
    """;

        jdbcTemplate.update(sql, itemId, delta, reason);
    }

    public InventoryTransaction findById(Long id) {
        String sql = """
        SELECT id, item_id, delta, reason, created_at
        FROM inventory_transaction
        WHERE id = ?
    """;

        return jdbcTemplate.queryForObject(
                sql,
                InventoryTransactionRowMapper,
                id
        );
    }



}
