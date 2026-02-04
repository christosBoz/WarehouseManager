import { useEffect, useState } from "react";
import InventoryGrid from "../components/InventoryGrid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  Input
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";
import "./inventory.css";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import TopNav from "../components/TopNav";
import { Box, TextField, MenuItem } from "@mui/material";

function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mergeEnabled, setMergeEnabled] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustDelta, setAdjustDelta] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const mergeItems = (items: any[]) => {
    const map = new Map();

    for (const item of items) {
      const key = `${item.name.toLowerCase()}-${item.status}`;

      if (!map.has(key)) {
        map.set(key, {
          ...item,
          quantity: Number(item.quantity),
          mergedCount: 1,
        });
      } else {
        const existing = map.get(key);
        existing.quantity += Number(item.quantity);
        existing.mergedCount += 1;
      }
    }

    return Array.from(map.values());
  };

  const displayItems = mergeEnabled ? mergeItems(filteredItems) : filteredItems;

  const handleDelete = (id: Number) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    fetch(`http://localhost:8080/api/items/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");

        setItems((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete item");
      });
  };

  const handleEdit = () => {
    setEditItem({ ...selectedItem });
    setEditOpen(true);
  };
  function handleSnackBarClose() {
    setSuccess(false);
  }
  const handleSave = () => {
    fetch(`http://localhost:8080/api/items/${editItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editItem.name,
        description: editItem.description,
        quantity: Number(editItem.quantity),
        locationId: Number(editItem.locationId),
        status: editItem.status,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to edit item");

        setItems((prev) =>
          prev.map((item) => (item.id === editItem.id ? editItem : item)),
        );

        setSelectedItem(editItem);
        setDetailsOpen(false);
        setSuccess(true);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save changes");
      });
  };

  const handleAdjust = () => {
    console.log("POOOOOP");
    fetch(`http://localhost:8080/api/items/${selectedItem.id}/adjust`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        delta: adjustDelta,
        reason: adjustReason,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Adjustment failed");

        setItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, quantity: item.quantity + adjustDelta }
              : item,
          ),
        );

        setAdjustOpen(false);
        setAdjustDelta(0);
        setAdjustReason("");
        setSuccess(true);
      })
      .catch(() => alert("Invalid adjustment"));
  };

  const undoTransaction = (transactionId: number) => {
    fetch(`http://localhost:8080/api/transactions/${transactionId}/undo`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Undo failed");

        // Reload item + history to stay correct
        loadHistory(selectedItem.id);

        setItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  quantity:
                    item.quantity -
                    transactions.find((t) => t.id === transactionId).delta,
                }
              : item,
          ),
        );
      })
      .catch(() => alert("Failed to undo transaction"));
  };

  const loadHistory = (itemId: number) => {
    fetch(`http://localhost:8080/api/transactions/item/${itemId}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error(err));
  };

  return (
    <div
      className="inventoryRoot"
      style={{ padding: "24px", minHeight: "100vh" }}
    >
      <TopNav></TopNav>
      <div className="InvHeader">
        <div className="InvActions">
          <Input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            color="success"
          />

          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => navigate("/create")}
          >
            Add Item
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={mergeEnabled}
                onChange={() => setMergeEnabled((prev) => !prev)}
                color="primary"
              />
            }
            label="Merge items by name"
          />

          {mergeEnabled && (
            <Chip
              label="Merged view enabled"
              color="info"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </div>
      </div>

      <InventoryGrid
        rows={displayItems}
        loading={loading}
        onDelete={handleDelete}
        onRowSelect={(item) => {
          setSelectedItem(item);
          setDetailsOpen(true);
        }}
        mergeItem={mergeEnabled}
      />

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Item Details</DialogTitle>

        <DialogContent>
          {!editOpen && selectedItem && (
            <>
              <div className="ItemDetails">
                <p>
                  <strong>Name:</strong> {selectedItem.name}
                </p>
                {!mergeEnabled && (
                  <p>
                    <strong>Description:</strong> {selectedItem.description}
                  </p>
                )}
                <p>
                  <strong>Quantity:</strong> {selectedItem.quantity}
                </p>
                <p>
                  <strong>Location:</strong> {selectedItem.locationId}
                </p>
                <p>
                  <strong>Status:</strong> {selectedItem.status}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </p>
              </div>
            </>
          )}

          {editOpen && editItem && (
            <DialogContent dividers>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mt: 1,
                }}
              >
                {/* Item Name */}
                <TextField
                  label="Item Name"
                  value={editItem.name}
                  onChange={(e) =>
                    setEditItem({ ...editItem, name: e.target.value })
                  }
                  fullWidth
                  sx={{ gridColumn: "1 / -1" }}
                />

                {/* Description */}
                <TextField
                  label="Description"
                  value={editItem.description || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, description: e.target.value })
                  }
                  multiline
                  rows={3}
                  fullWidth
                  sx={{ gridColumn: "1 / -1" }}
                />

                {/* Location */}
                <TextField
                  label="Location ID"
                  type="number"
                  value={editItem.locationId}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      locationId: Number(e.target.value),
                    })
                  }
                  fullWidth
                />

                {/* Status */}
                <TextField
                  select
                  label="Status"
                  value={editItem.status}
                  onChange={(e) =>
                    setEditItem({ ...editItem, status: e.target.value })
                  }
                  fullWidth
                >
                  <MenuItem value="FULL">Full</MenuItem>
                  <MenuItem value="PARTIAL">Partial</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
          )}
        </DialogContent>

        <DialogActions>
          {!editOpen && (
            <>
              {/* Close = neutral */}
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setDetailsOpen(false)}
              >
                Close
              </Button>

              {/* Edit = primary */}
              {!mergeEnabled && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}

              {/* Adjust = action */}
              <Button
                variant="contained"
                color="success"
                onClick={() => setAdjustOpen(true)}
              >
                Adjust Quantity
              </Button>

              {/* History = secondary */}
              <Button
                variant="outlined"
                color="info"
                onClick={() => {
                  loadHistory(selectedItem.id);
                  setHistoryOpen(true);
                }}
              >
                History
              </Button>
            </>
          )}

          {editOpen && (
            <>
              {/* Back = navigation */}
              <Button
                variant="text"
                color="inherit"
                onClick={() => {
                  setEditOpen(false);
                  setDetailsOpen(true);
                }}
              >
                Back
              </Button>

              {/* Save = confirm */}
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)}>
        <DialogTitle>Adjust Inventory</DialogTitle>

        <DialogContent>
          <input
            type="number"
            value={adjustDelta}
            onChange={(e) => setAdjustDelta(Number(e.target.value))}
            placeholder="Quantity change (e.g. -3 or +5)"
          />

          <input
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            placeholder="Reason"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAdjustOpen(false)}>Cancel</Button>
          <Button onClick={handleAdjust} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Transaction History</DialogTitle>

        <DialogContent>
          <DataGrid
            rows={transactions}
            columns={[
              {
                field: "createdAt",
                headerName: "Date",
                flex: 1,
                valueFormatter: (p: any) => new Date(p.value).toLocaleString(),
              },
              {
                field: "delta",
                headerName: "Change",
                width: 120,
                renderCell: (p) => (p.value > 0 ? `+${p.value}` : p.value),
              },
              {
                field: "reason",
                headerName: "Reason",
                flex: 2,
              },
              {
                field: "undo",
                headerName: "",
                width: 90,
                renderCell: (p) => (
                  <Button
                    size="small"
                    color="warning"
                    onClick={() => undoTransaction(p.row.id)}
                  >
                    {" "}
                    Undo{" "}
                  </Button>
                ),
              },
            ]}
            getRowId={(row: any) => row.id}
            autoHeight
            hideFooter
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {success && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
          open={success}
          onClose={handleSnackBarClose}
          message="Item Added"
        />
      )}
    </div>
  );
}

export default Inventory;
