import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/dashboard/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';
import IndicatorListPage from './pages/indicators/IndicatorListPage';
import NewIndicatorPage from './pages/indicators/NewIndicatorPage';
import EditIndicatorPage from './pages/indicators/EditIndicatorPage';
import DataEntryPage from './pages/indicators/DataEntryPage';
import LoadingSpinner from './components/common/LoadingSpinner';

// CSS imports
import './styles/globals.css';
import './styles/components/layout.css';
import './styles/components/auth.css';
import './styles/components/dashboard.css';
import './styles/pages/indicator-list.css';
import './styles/pages/indicator-form.css';
import './styles/pages/data-entry.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Yetkilendirme kontrol ediliyor..." />;
  }
  
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Yetkilendirme kontrol ediliyor..." />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/auth/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        
        {/* Private Routes */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/auth/profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />
        
        {/* Indicator Routes */}
        <Route 
          path="/indicators" 
          element={
            <PrivateRoute>
              <IndicatorListPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/indicators/new" 
          element={
            <PrivateRoute>
              <NewIndicatorPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/indicators/edit/:id" 
          element={
            <PrivateRoute>
              <EditIndicatorPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/indicators/data-entry" 
          element={
            <PrivateRoute>
              <DataEntryPage />
            </PrivateRoute>
          } 
        />
        
        {/* Placeholder routes for future development */}
        <Route 
          path="/students" 
          element={
            <PrivateRoute>
              <div className="dashboard-container">
                <div className="page-header">
                  <h1 className="page-title">Öğrenciler</h1>
                  <p className="page-subtitle">Bu sayfa henüz geliştirilme aşamasında</p>
                </div>
              </div>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/courses" 
          element={
            <PrivateRoute>
              <div className="dashboard-container">
                <div className="page-header">
                  <h1 className="page-title">Dersler</h1>
                  <p className="page-subtitle">Bu sayfa henüz geliştirilme aşamasında</p>
                </div>
              </div>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/grades" 
          element={
            <PrivateRoute>
              <div className="dashboard-container">
                <div className="page-header">
                  <h1 className="page-title">Notlar</h1>
                  <p className="page-subtitle">Bu sayfa henüz geliştirilme aşamasında</p>
                </div>
              </div>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/departments" 
          element={
            <PrivateRoute>
              <div className="dashboard-container">
                <div className="page-header">
                  <h1 className="page-title">Bölümler</h1>
                  <p className="page-subtitle">Bu sayfa henüz geliştirilme aşamasında</p>
                </div>
              </div>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/faculty" 
          element={
            <PrivateRoute>
              <div className="dashboard-container">
                <div className="page-header">
                  <h1 className="page-title">Akademisyenler</h1>
                  <p className="page-subtitle">Bu sayfa henüz geliştirilme aşamasında</p>
                </div>
              </div>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <PrivateRoute>
              <div className="dashboard-container">
                <div className="page-header">
                  <h1 className="page-title">Raporlar</h1>
                  <p className="page-subtitle">Bu sayfa henüz geliştirilme aşamasında</p>
                </div>
              </div>
            </PrivateRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route 
          path="*" 
          element={
            <div className="dashboard-container">
              <div className="page-header">
                <h1 className="page-title">404 - Sayfa Bulunamadı</h1>
                <p className="page-subtitle">Aradığınız sayfa bulunamadı.</p>
              </div>
              <div className="card">
                <div className="card-content">
                  <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                  </p>
                  <div style={{ textAlign: 'center' }}>
                    <a href="/" className="btn btn-primary">
                      Ana Sayfaya Dön
                    </a>
                  </div>
                </div>
              </div>
            </div>
          } 
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
