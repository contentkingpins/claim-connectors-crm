import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Amplify } from 'aws-amplify';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FirmPortalPage from './pages/FirmPortalPage';
import CPAPerformancePage from './pages/CPAPerformancePage';
import ClaimsManagementPage from './pages/ClaimsManagementPage';
import { UserRole } from './context/AuthContext';

// Import other pages as needed
// import FirmPortalPage from './pages/FirmPortalPage';
// import ProfilePage from './pages/ProfilePage';
// import AdminPage from './pages/AdminPage';

// Configure Amplify with fallback values if environment variables are missing
try {
  Amplify.configure({
    Auth: {
      region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
      mandatorySignIn: true,
    }
  });
} catch (error) {
  console.warn('Error configuring Amplify:', error);
  // Continue with the app even if Amplify configuration fails
  // This allows the app to run with mock data in development
}

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes for all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={
                <Navigation>
                  <DashboardPage />
                </Navigation>
              } />
              <Route path="/claims" element={
                <Navigation>
                  <ClaimsManagementPage />
                </Navigation>
              } />
              <Route path="/cpa-performance" element={
                <Navigation>
                  <CPAPerformancePage />
                </Navigation>
              } />
              {/* <Route path="/profile" element={
                <Navigation>
                  <ProfilePage />
                </Navigation>
              } /> */}
              {/* Add other routes wrapped in Navigation */}
            </Route>
            
            {/* Protected routes for admin users only */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              {/* <Route path="/admin" element={
                <Navigation>
                  <AdminPage />
                </Navigation>
              } /> */}
            </Route>
            
            {/* Protected routes for firm users only */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.FIRM]} />}>
              <Route path="/firm-portal" element={
                <Navigation>
                  <FirmPortalPage />
                </Navigation>
              } />
            </Route>
            
            {/* Redirect root to dashboard or login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 