
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ModeratorOverview from "../components/dashboard/moderator/ModeratorOverview";
import ModeratorReviewProjects from "../components/dashboard/moderator/ModeratorReviewProjects";
import ModeratorReviewProposals from "../components/dashboard/moderator/ModeratorReviewProposals";
import ModeratorChallenges from "../components/dashboard/moderator/ModeratorChallenges";
import ModeratorSettings from "../components/dashboard/moderator/ModeratorSettings";

const ModeratorDashboard = () => {
  return (
    <DashboardLayout type="moderator">
      <Routes>
        <Route path="/" element={<ModeratorOverview />} />
        <Route path="/review" element={<ModeratorReviewProjects />} />
        <Route path="/proposals" element={<ModeratorReviewProposals />} />
        <Route path="/challenges" element={<ModeratorChallenges />} />
        <Route path="/settings" element={<ModeratorSettings />} />
        <Route path="*" element={<Navigate to="/moderator-dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ModeratorDashboard;