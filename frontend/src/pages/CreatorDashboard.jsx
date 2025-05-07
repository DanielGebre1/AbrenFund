
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import CreatorOverview from "../components/dashboard/creator/CreatorOverview";
import CreatorProjects from "../components/dashboard/creator/CreatorProjects";
import CreatorProposals from "../components/dashboard/creator/CreatorProposals";
import CreatorChallenges from "../components/dashboard/creator/CreatorChallenges";
import CreatorMessages from "../components/dashboard/creator/CreatorMessages";

const CreatorDashboard = () => {
  return (
    <DashboardLayout type="creator">
      <Routes>
        <Route path="/" element={<CreatorOverview />} />
        <Route path="/projects" element={<CreatorProjects />} />
        <Route path="/proposals" element={<CreatorProposals />} />
        <Route path="/challenges" element={<CreatorChallenges />} />
        <Route path="/messages" element={<CreatorMessages />} />
        <Route path="*" element={<Navigate to="/creator-dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default CreatorDashboard;