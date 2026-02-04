import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import "./dashboard.css";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Chip } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

function Dashboard() {
  const navigate = useNavigate();
  const [jobList, setJobList] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [miniInv, setMiniInv] = useState<any[]>([]);

  const inventoryColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Item",
      flex: 2,
      minWidth: 150,
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 90,
      align: "center",
      headerAlign: "center",
      cellClassName: (params) => (params.value <= 5 ? "lowStock" : ""),
    },
    {
      field: "locationId",
      headerName: "Location",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
  ];

  const jobColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Job Name",
      flex: 2,
      minWidth: 150,
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
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (p) => {
        if (p.value === "HIGH") {
          return <Chip label="HIGH" color="error" size="small" />;
        }

        if (p.value === "NORMAL") {
          return <Chip label="NORMAL" color="warning" size="small" />;
        }

        return <Chip label={p.value} size="small" variant="outlined" />;
      },
    },
  ];

  const fetchLatestInv = () => {
    fetch("http://localhost:8080/api/items/recent?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setMiniInv(data);
        // setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        // setLoading(false);
      });
  };

  const fetchLatestJobs = () => {
    fetch("http://localhost:8080/api/jobs/recent?limit=5")
      .then((res) => res.json())
      .then((data) => {
        setJobList(data);
        // setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        // setLoading(false);
      });
  };

  useEffect(() => {
    fetchLatestInv();
    fetchLatestJobs();
  }, []);

  const grossStats = jobList.reduce(
    (acc: any, job: any) => {
      const pay = Number(job.grossPay) || 0;

      acc.total += pay;
      if (pay > 0) acc.count += 1;

      return acc;
    },
    { total: 0, count: 0 },
  );
  const grossPayData = jobList
    .filter((job: any) => Number(job.grossPay) > 0)
    .map((job: any) => ({
      label: job.name,
      value: Number(job.grossPay),
    }));

  const avgGross =
    grossStats.count > 0 ? grossStats.total / grossStats.count : 0;

  return (
    <div className="dashboard">
      <TopNav />

      <div className="dashboardGrid">
        <div className="card jobBox" onClick={() => navigate("/job")}>
          <h3>Active Jobs</h3>
          <DataGrid
            rows={jobList}
            columns={jobColumns}
            getRowId={(row) => row.id}
            hideFooter
            disableColumnMenu
            disableRowSelectionOnClick
            density="standard"
            autoHeight
          />
        </div>

        <div className="card stockBox">
          <h3>Gross Pay by Job</h3>

          {grossPayData.length > 0 ? (
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: grossPayData.map((d) => d.label),
                },
              ]}
              series={[
                {
                  data: grossPayData.map((d) => d.value),
                  label: "Gross Pay ($)",
                },
              ]}
              height={240}
              margin={{ top: 20, bottom: 60, left: 60, right: 20 }}
            />
          ) : (
            <p>No gross pay data yet</p>
          )}
        </div>

        <div
          className="card inventoryBox"
          onClick={() => navigate("/inventory")}
        >
          <h3>Recent Additions to Inventory</h3>
          <DataGrid
            rows={miniInv}
            columns={inventoryColumns}
            getRowId={(row) => row.id}
            hideFooter
            disableColumnMenu
            disableRowSelectionOnClick
            density="standard"
            autoHeight
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
