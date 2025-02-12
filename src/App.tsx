import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TaskList from "./pages/TaskList";
import Board from "./pages/Board";
import Layout from "./layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<TaskList />} />
            <Route path="/board" element={<Board />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
