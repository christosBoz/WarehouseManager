import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "./jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editJob, setEditJob] = useState<any | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/jobs/parents")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "⚠️ This will delete this job AND all sub-jobs. This cannot be undone.\n\nContinue?",
    );
    if (!confirmed) return;

    fetch(`http://localhost:8080/api/jobs/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        setJobs((prev) => prev.filter((job) => job.id !== id));
        setDetailsOpen(false);
      })
      .catch(() => alert("Failed to delete job"));
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Job",
      flex: 2,
    },
    {
      field: "jobStatus",
      headerName: "Status",
      width: 130,
      renderCell: (p) => (
        <Chip
          label={p.value}
          color={
            p.value === "ACTIVE"
              ? "success"
              : p.value === "PLANNED"
                ? "info"
                : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "jobPriority",
      headerName: "Priority",
      width: 130,
      renderCell: (p) => (
        <Chip
          label={p.value}
          color={
            p.value === "HIGH"
              ? "error"
              : p.value === "NORMAL"
                ? "warning"
                : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "startDate",
      headerName: "Start",
      width: 140,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      field: "endDate",
      headerName: "End",
      width: 140,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
  ];

  const handleEdit = () => {
    setEditJob({ ...selectedJob });
    setEditOpen(true);
    console.log(editJob);
  };

  const handleSave = () => {
    fetch(`http://localhost:8080/api/jobs/${editJob.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editJob),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");

        setJobs((prev) =>
          prev.map((job) => (job.id === editJob.id ? editJob : job)),
        );

        setSelectedJob(editJob);
        setEditOpen(false);
      })
      .catch(() => alert("Failed to save job"));
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <TopNav />

      <div className="InvHeader">
        <h2 style={{ color: "black" }}>Jobs</h2>

        <div className="InvActions">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => navigate("/jobs/create")}
          >
            Add Job
          </Button>
        </div>
      </div>

      <div style={{ background: "#021707", borderRadius: 12 }}>
        <DataGrid
          rows={jobs}
          columns={columns}
          loading={loading}
          autoHeight
          hideFooter
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          onRowClick={(p) => {
            setSelectedJob(p.row);
            setDetailsOpen(true);
          }}
        />
      </div>

      {/* Job Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Job Details</DialogTitle>

        <DialogContent>
          {selectedJob && (
            <div className="ItemDetails">
              <p>
                <strong>Name:</strong> {selectedJob.name}
              </p>
              <p>
                <strong>Type:</strong> {selectedJob.jobType}
              </p>
              <p>
                <strong>Status:</strong> {selectedJob.jobStatus}
              </p>
              <p>
                <strong>Priority:</strong> {selectedJob.jobPriority}
              </p>
              <p>
                <strong>Gross Pay:</strong>{" "}
                {`$${selectedJob.grossPay.toFixed(2)}`}
              </p>
              <p>
                <strong>Description:</strong> {selectedJob.description || "-"}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {selectedJob.startDate
                  ? new Date(selectedJob.startDate).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {selectedJob.endDate
                  ? new Date(selectedJob.endDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)} color="secondary">
            Close
          </Button>
          <Button onClick={() => handleEdit()} color="info">
            Edit
          </Button>
          <Button color="error" onClick={() => handleDelete(selectedJob.id)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Job</DialogTitle>

        <DialogContent dividers>
          {editJob && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: 1,
              }}
            >
              {/* Job Name */}
              <TextField
                label="Job Name"
                value={editJob.name}
                onChange={(e) =>
                  setEditJob({ ...editJob, name: e.target.value })
                }
                fullWidth
                sx={{ gridColumn: "1 / -1" }}
              />

              {/* Description */}
              <TextField
                label="Description"
                value={editJob.description || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, description: e.target.value })
                }
                multiline
                rows={3}
                fullWidth
                sx={{ gridColumn: "1 / -1" }}
              />

              {/* Status */}
              <TextField
                select
                label="Status"
                value={editJob.jobStatus}
                onChange={(e) =>
                  setEditJob({ ...editJob, jobStatus: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="PLANNED">Planned</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </TextField>

              {/* Priority */}
              <TextField
                select
                label="Priority"
                value={editJob.jobPriority}
                onChange={(e) =>
                  setEditJob({ ...editJob, jobPriority: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </TextField>

              {/* Start Date */}
              <TextField
                label="Start Date"
                type="date"
                value={editJob.startDate || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, startDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              {/* End Date */}
              <TextField
                label="End Date"
                type="date"
                value={editJob.endDate || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, endDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Gross Pay"
                type="number"
                value={editJob.grossPay ?? ""}
                onChange={(e) =>
                  setEditJob({
                    ...editJob,
                    grossPay: Number(e.target.value),
                  })
                }
                fullWidth
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="success">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Jobs;
