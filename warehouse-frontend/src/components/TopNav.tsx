import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function TopNav() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff", // dark slate
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          Warehouse Admin
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/inventory")}>
            Inventory
          </Button>
          <Button color="inherit" onClick={() => navigate("/job")}>
            Jobs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopNav;
