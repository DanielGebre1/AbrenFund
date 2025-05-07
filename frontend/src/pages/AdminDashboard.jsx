
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import AdminOverview from "../components/dashboard/admin/AdminOverview";
import AdminUsers from "../components/dashboard/admin/AdminUsers";
import AdminProjects from "../components/dashboard/admin/AdminProjects";
import AdminAnalytics from "../components/dashboard/admin/AdminAnalytics";
import AdminSettings from "../components/dashboard/admin/AdminSettings";

const AdminDashboard = () => {
  return (
    <DashboardLayout type="admin">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/projects" element={<AdminProjects />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
