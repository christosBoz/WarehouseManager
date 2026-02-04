package com.omega.warehousebackend.repository;

import com.omega.warehousebackend.model.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

@Repository
public class JobRepository {
    private final JdbcTemplate jdbcTemplate;
    public JobRepository(JdbcTemplate template) {
        this.jdbcTemplate = template;
    }

    private final RowMapper<Job> jobRowMapper = new RowMapper<Job>() {
        @Override
        public Job mapRow(ResultSet rs, int rowNum) throws SQLException {
            Job job = new Job();

            job.setId(rs.getLong("id"));

            // parent_job_id (nullable)
            Long parentJobId = rs.getLong("parent_job_id");
            if (rs.wasNull()) {
                parentJobId = null;
            }
            job.setParentJobId(parentJobId);

            job.setName(rs.getString("name"));

            // Enums
            job.setJobType(JobType.valueOf(rs.getString("job_type")));
            job.setJobStatus(JobStatus.valueOf(rs.getString("status")));
            job.setJobPriority(JobPriority.valueOf(rs.getString("priority")));

            job.setDescription(rs.getString("description"));

            // Dates
            String startDateStr = rs.getString("start_date");
            if (startDateStr != null) {
                job.setStartDate(LocalDate.parse(startDateStr));
            }

            String endDateStr = rs.getString("end_date");
            if (endDateStr != null) {
                job.setEndDate(LocalDate.parse(endDateStr));
            }

            // Timestamps
            if (rs.getTimestamp("created_at") != null) {
                job.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            }

            if (rs.getTimestamp("updated_at") != null) {
                job.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            }
            job.setGrossPay(rs.getInt("gross_pay"));


            return job;
        }
    };


    public List<Job> findAll() {
        String sql = "SELECT * FROM jobs";
        return jdbcTemplate.query(sql, jobRowMapper);
    }

    public Job findById(Long id) {
        String sql = "SELECT * FROM jobs WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, jobRowMapper, id);
    }

    public void save(Job job) {
        String sql = """
        INSERT INTO jobs
        (parent_job_id, name, job_type, status, priority, description, start_date, end_date, gross_pay)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;

        jdbcTemplate.update(
                sql,
                job.getParentJobId(),
                job.getName(),
                job.getJobType().name(),
                job.getJobStatus().name(),
                job.getJobPriority().name(),
                job.getDescription(),
                job.getStartDate(),
                job.getEndDate(),
                job.getGrossPay()
        );
    }
    public void update(Job job) {
        String sql = """
        UPDATE jobs
        SET
            parent_job_id = ?,
            name = ?,
            job_type = ?,
            status = ?,
            priority = ?,
            description = ?,
            start_date = ?,
            end_date = ?,
            updated_at = CURRENT_TIMESTAMP,
            gross_pay = ?
        
        WHERE id = ?
    """;

        jdbcTemplate.update(
                sql,
                job.getParentJobId(),
                job.getName(),
                job.getJobType().name(),
                job.getJobStatus().name(),
                job.getJobPriority().name(),
                job.getDescription(),
                job.getStartDate(),
                job.getEndDate(),
                job.getGrossPay(),
                job.getId()

        );
    }
    public void deleteById(Long id) {
        String sql = "DELETE FROM jobs WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public List<Job> findByParentJobId(Long parentId) {
        String sql = "SELECT * FROM jobs WHERE parent_job_id = ?";
        return jdbcTemplate.query(sql, jobRowMapper, parentId);
    }

    public List<Job> findParentJobs() {
        String sql = "SELECT * FROM jobs WHERE parent_job_id IS NULL";
        return jdbcTemplate.query(sql, jobRowMapper);
    }

    public List<Job> findRecentJobsDesc(int count) {
        String sql = """
        SELECT * FROM jobs
        ORDER BY created_at DESC
        LIMIT ?
    """;

        return jdbcTemplate.query(
                sql,
                jobRowMapper,
                count
        );
    }





}
