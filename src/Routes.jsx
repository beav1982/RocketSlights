import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import UserAuthentication from "pages/user-authentication";
import GameResultsStatistics from "pages/game-results-statistics";
import GameLobbyDashboard from "pages/game-lobby-dashboard";
import UserProfileManagement from "pages/user-profile-management";
import ActiveGameplayInterface from "pages/active-gameplay-interface";
import GameRoomSetup from "pages/game-room-setup";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<GameLobbyDashboard />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="/game-results-statistics" element={<GameResultsStatistics />} />
        <Route path="/game-lobby-dashboard" element={<GameLobbyDashboard />} />
        <Route path="/user-profile-management" element={<UserProfileManagement />} />
        <Route path="/active-gameplay-interface" element={<ActiveGameplayInterface />} />
        <Route path="/game-room-setup" element={<GameRoomSetup />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;