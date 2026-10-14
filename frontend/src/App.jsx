import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Landing Page (Source of truth: Cybersecurity Landing Page Design)
import LandingPage from './pages/LandingPage';

// Security Console Shell Layout
import ConsoleLayout from './components/ConsoleLayout';

// Internal Security Console Pages (Source of truth: Hackathon-Project dashboard)
import Overview from './pages/Overview';
import AccountPortal from './pages/AccountPortal';
import FinanceBot from './pages/FinanceBot';
import SecurityGraph from './pages/SecurityGraph';
import LiveMonitor from './pages/LiveMonitor';
import IncidentExplorer from './pages/IncidentExplorer';
import PolicyStudio from './pages/PolicyStudio';
import IdentityView from './pages/IdentityView';
import AttackLab from './pages/AttackLab';
import AuditExplorer from './pages/AuditExplorer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Experience A: Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Experience B: Internal Security Console Routes */}
        <Route
          path="/console"
          element={
            <ConsoleLayout>
              <Overview />
            </ConsoleLayout>
          }
        />
        <Route
          path="/accounts"
          element={
            <ConsoleLayout>
              <AccountPortal />
            </ConsoleLayout>
          }
        />
        <Route
          path="/finance"
          element={
            <ConsoleLayout>
              <FinanceBot />
            </ConsoleLayout>
          }
        />
        <Route
          path="/graph"
          element={
            <ConsoleLayout>
              <SecurityGraph />
            </ConsoleLayout>
          }
        />
        <Route
          path="/monitor"
          element={
            <ConsoleLayout>
              <LiveMonitor />
            </ConsoleLayout>
          }
        />
        <Route
          path="/incidents"
          element={
            <ConsoleLayout>
              <IncidentExplorer />
            </ConsoleLayout>
          }
        />
        <Route
          path="/policies"
          element={
            <ConsoleLayout>
              <PolicyStudio />
            </ConsoleLayout>
          }
        />
        <Route
          path="/identity"
          element={
            <ConsoleLayout>
              <IdentityView />
            </ConsoleLayout>
          }
        />
        <Route
          path="/attack-lab"
          element={
            <ConsoleLayout>
              <AttackLab />
            </ConsoleLayout>
          }
        />
        <Route
          path="/audit"
          element={
            <ConsoleLayout>
              <AuditExplorer />
            </ConsoleLayout>
          }
        />

        {/* Fallback Catch-all: Redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
