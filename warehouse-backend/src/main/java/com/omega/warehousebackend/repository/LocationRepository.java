package com.omega.warehousebackend.repository;

import com.omega.warehousebackend.model.Location;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;


//This is what talks to SQL using their commands.
@Repository
public class LocationRepository {

    private final JdbcTemplate jdbcTemplate;

    public LocationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Location> locationRowMapper = new RowMapper<Location>() {
        @Override
        public Location mapRow(ResultSet rs, int rowNum) throws SQLException {
            Location location = new Location();
            location.setId(rs.getLong("id"));
            location.setShelf(rs.getInt("shelf"));

            return location;
        }
    };

    public List<Location> findAll() {
        String sql = "SELECT * FROM location";
        return jdbcTemplate.query(sql, locationRowMapper);
    }

    //check if the location id is there if not then most likely means trying to place in a shelf that doesn't exist.
    public boolean doesIdExist(Long id) {
        String sql = "Select COUNT(*) FROM location WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

}
