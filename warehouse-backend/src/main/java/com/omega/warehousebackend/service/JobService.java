package com.omega.warehousebackend.service;

import com.omega.warehousebackend.model.Item;
import com.omega.warehousebackend.model.Job;
import com.omega.warehousebackend.repository.ItemRepository;
import com.omega.warehousebackend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public void saveJob(Job job) {
        System.out.println(job.getStartDate());
        validateJob(job);
        jobRepository.save(job);
    }

    public void updateJob(Job job) {
        validateJob(job);
        jobRepository.update(job);
    }

    public void deleteJob(Long id) {
        List<Job> children = jobRepository.findByParentJobId(id);
        for (Job child : children) {
            deleteJob(child.getId());
        }
        jobRepository.deleteById(id);
    }

    public List<Job> findChildJobs(Long parentId) {
        return jobRepository.findByParentJobId(parentId);
    }

    public List<Job> findParentJobs() {
        return jobRepository.findParentJobs();
    }


    public List<Job> fetchRecentJobs(int count) {
        int safeLimit = Math.min(count, 5);
        return jobRepository.findRecentJobsDesc(safeLimit);
    }

    private void validateJob(Job job) {

        if (job.getName() == null || job.getName().isBlank()) {
            throw new IllegalArgumentException("Job requires a name");
        }

        if (job.getJobType() == null) {
            throw new IllegalArgumentException("Job requires a job type");
        }

        if (job.getJobStatus() == null) {
            throw new IllegalArgumentException("Job requires a status");
        }

        if (job.getJobPriority() == null) {
            throw new IllegalArgumentException("Job requires a priority");
        }

        // parent job validation
        if (job.getParentJobId() != null) {
            Job parent = jobRepository.findById(job.getParentJobId());

            if (parent == null) {
                throw new IllegalArgumentException("Parent job does not exist");
            }

            if (job.getId() != null && job.getId().equals(job.getParentJobId())) {
                throw new IllegalArgumentException("Job cannot be its own parent");
            }
        }
    }

}
