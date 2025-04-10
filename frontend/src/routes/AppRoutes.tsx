import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import UserDashboard from "../pages/user/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import AddSubscriber from "../pages/admin/AddSubscriber";
import Dashboard from "../pages/admin/Dashboard";
import ViewSubscribers from "../pages/admin/ViewSubscribers";
import Profile from "../pages/admin/Profile";
import AddSubscriptionList from "../pages/admin/AddSubscriptionList";
import SubscriptionListPage from "../pages/admin/SubscriptionListPage";


const AppRoutes = () => {
  const { user } = useUser();

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

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset" element={<ResetPassword />} />


        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-subscriber" element={<AddSubscriber />} />
        <Route path="/admin/view-subscribers" element={<ViewSubscribers />} />


        <Route path="/profile" element={<Profile />} />

        <Route path="/admin/subscription-list/add" element={<AddSubscriptionList />} />

        <Route path="/admin/subscription-lists" element={<SubscriptionListPage />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
