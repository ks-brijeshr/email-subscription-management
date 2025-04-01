import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import UserDashboard from "../pages/user/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  const { user } = useUser();  // Access user from context

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Route */}
        <Route element={<ProtectedRoute isAllowed={user?.is_owner === true} redirectPath="/user/dashboard" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Protected User Route */}
        <Route element={<ProtectedRoute isAllowed={user?.is_owner === false} redirectPath="/admin/dashboard" />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Default Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
