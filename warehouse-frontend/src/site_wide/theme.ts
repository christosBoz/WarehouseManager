import { createTheme } from "@mui/material/styles";

const lightBlueTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#fcfcfc", // blue-600
    },
    secondary: {
      main: "#000000",
    },
    background: {
      default: "#f8fafc", // page background (light gray)
      paper: "#ffffff",   // cards/dialogs
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default lightBlueTheme;
