import { Routes, Route, Navigate } from "react-router-dom";
import Inventory from "./inventory/Inventory";
import Create from "./create_table_page/createPage";
import Dashboard from "./dashboard/dashboard";
import Job from "./jobs/jobs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/create" element={<Create />} />
      <Route path="/job" element={<Job />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
