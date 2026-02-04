package com.omega.warehousebackend.controller;



import com.omega.warehousebackend.model.Item;
import com.omega.warehousebackend.model.Job;
import com.omega.warehousebackend.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // ------------------------
    // GET all jobs (flat)
    // ------------------------
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // ------------------------
    // GET job by id
    // ------------------------
    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    // ------------------------
    // GET parent jobs (top-level)
    // ------------------------
    @GetMapping("/parents")
    public List<Job> getParentJobs() {
        return jobService.findParentJobs();
    }

    // ------------------------
    // GET child jobs for a parent
    // ------------------------
    @GetMapping("/{id}/children")
    public List<Job> getChildJobs(@PathVariable Long id) {
        return jobService.findChildJobs(id);
    }

    // ------------------------
    // CREATE job
    // ------------------------
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createJob(@RequestBody Job job) {
        jobService.saveJob(job);
    }

    // ------------------------
    // UPDATE job
    // ------------------------
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateJob(@PathVariable Long id, @RequestBody Job job) {
        // enforce correct id
        job.setId(id);
        jobService.updateJob(job);
    }

    // ------------------------
    // DELETE job (recursive)
    // ------------------------
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
    }

    @GetMapping("/recent")
    public List<Job> getRecentItems(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return jobService.fetchRecentJobs(limit);
    }
}

