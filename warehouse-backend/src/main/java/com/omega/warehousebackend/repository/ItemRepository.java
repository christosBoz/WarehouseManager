package com.omega.warehousebackend.repository;

import com.omega.warehousebackend.model.Item;
import com.omega.warehousebackend.model.ItemStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;


//This is what talks to SQL using their commands.
@Repository
public class ItemRepository {

    private final JdbcTemplate jdbcTemplate;
    public ItemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Item> itemRowMapper = new RowMapper<Item>() {
        @Override
        public Item mapRow(ResultSet rs, int rowNum) throws SQLException {
            Item item = new Item();
            item.setId(rs.getLong("id"));
            item.setName(rs.getString("name"));
            item.setDescription(rs.getString("description"));
            item.setQuantity(rs.getInt("quantity"));
            item.setItemStatus(ItemStatus.valueOf(rs.getString("status")));
            item.setImagePath(rs.getString("image_path"));
            item.setLocationId(rs.getLong("location_id"));
            item.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            return item;
        }
    };


//    crud methods.

    public List<Item> findAll() {
        String sql = "SELECT * FROM item";
        return jdbcTemplate.query(sql, itemRowMapper);
    }

    public Item findById(Long id) {
        String sql = "SELECT * FROM item WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, itemRowMapper, id);
    }

    public void save(Item item) {
        String sql = "INSERT into item (name, description, quantity, image_path, location_id, status) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, item.getName(), item.getDescription(), item.getQuantity(), item.getImagePath(), item.getLocationId(), item.getStatus().name());
    }

    public void update(Item item) {
        String sql = """
    UPDATE item 
    SET name = ?, description = ?, quantity = ?, image_path = ?, location_id = ?, status = ?
    WHERE id = ?
    """;
        jdbcTemplate.update(sql, item.getName(), item.getDescription(), item.getQuantity(), item.getImagePath(), item.getLocationId(), item.getStatus().name(), item.getId());
    }

    public void delete(Item item) {
        String sql = """
                DELETE from item
                WHERE id = ?
                """;
        jdbcTemplate.update(sql, item.getId());
    }

    public void updateQuantity(Long itemId, int newQuantity) {
        String sql = """
        UPDATE item
        SET quantity = ?
        WHERE id = ?
    """;
        jdbcTemplate.update(sql, newQuantity, itemId);
    }

    public List<Item> findRecentItemsDesc(int count) {
        String sql = """
        SELECT * FROM item
        ORDER BY created_at DESC
        LIMIT ?
    """;

        return jdbcTemplate.query(
                sql,
                itemRowMapper,
                count
        );
    }

}
