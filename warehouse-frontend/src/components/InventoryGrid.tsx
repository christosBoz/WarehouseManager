import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Chip  } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";


type Props = {
  rows: any[];
  loading: boolean;
  onDelete: (id: number) => void;
  onRowSelect: (row: any) => void;
  mergeItem: boolean;
};






function InventoryGrid({ rows, loading, onDelete, onRowSelect, mergeItem }: Props) {
  const baseColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },

    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      width: 120,
      renderCell: (params) => 
        params.value <= 5 ? (
          <Chip 
          label={`Low (${params.value})`}
          color="error"
          size = "small"/>
        ) : (
          params.value
        ),
    },
    {
      field: "locationId",
      headerName: "Location",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(params.row.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const descriptionColumn: GridColDef = {
    field: "description",
    headerName: "Description",
    flex: 2,
  };

const columns: GridColDef[] = mergeItem
  ? baseColumns
  : [
      baseColumns[0],          // Name
      descriptionColumn,       // Description ONLY when not merged
      ...baseColumns.slice(1), // Rest
    ];

  


  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        onRowClick={(params) => onRowSelect(params.row)}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default InventoryGrid;
