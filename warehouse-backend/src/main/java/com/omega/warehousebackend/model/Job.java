package com.omega.warehousebackend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Job {
    private Long id;
    private Long parentJobId; //nullable
    private String name;
    private JobType jobType;
    private JobStatus jobStatus;
    private JobPriority jobPriority;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int grossPay;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParentJobId() {
        return parentJobId;
    }

    public void setParentJobId(Long parentJobId) {
        this.parentJobId = parentJobId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public JobStatus getJobStatus() {
        return jobStatus;
    }

    public void setJobStatus(JobStatus jobStatus) {
        this.jobStatus = jobStatus;
    }

    public JobPriority getJobPriority() {
        return jobPriority;
    }

    public void setJobPriority(JobPriority jobPriority) {
        this.jobPriority = jobPriority;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setGrossPay(int pay) {
        this.grossPay = pay;
    }

    public int getGrossPay() {
        return this.grossPay;
    }

}
