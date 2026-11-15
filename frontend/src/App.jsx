import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientRegister from './pages/register/PatientRegister';
import DoctorRegister from './pages/register/DoctorRegister';
import SupplierRegister from './pages/register/SupplierRegister';
import UserManagement from './pages/admin/UserManagement';
import FinanceDashboard from './pages/admin/FinanceDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminNoticeManagement from './pages/admin/AdminNoticeManagement';
import AdminBroadcast from './pages/admin/AdminBroadcast';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import LabDashboard from './pages/laboratory/LabDashboard';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOtp from './pages/VerifyOtp';
import HelpCenter from './pages/legal/HelpCenter';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import Security from './pages/legal/Security';
import Chatbot from './components/Chatbot';

function PrivateRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="auth-page"><div className="spinner" /></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/login" replace />;
    return children;
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="auth-page"><div className="spinner" /></div>;
    if (user) {
        if (user.role === 'ADMIN') return <Navigate to="/admin/users" replace />;
        if (user.role === 'DOCTOR') return <Navigate to="/doctor/dashboard" replace />;
        if (user.role === 'PHARMACIST') return <Navigate to="/pharmacy/dashboard" replace />;
        if (user.role === 'SUPPLIER') return <Navigate to="/supplier/dashboard" replace />;
        if (user.role === 'LAB_TECH') return <Navigate to="/lab/dashboard" replace />;
        return <Navigate to="/patient/dashboard" replace />;
    }
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/register/patient" element={<PublicRoute><PatientRegister /></PublicRoute>} />
                    <Route path="/register/doctor" element={<PublicRoute><DoctorRegister /></PublicRoute>} />
                    <Route path="/register/supplier" element={<PublicRoute><SupplierRegister /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                    <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />

                    {/* Admin */}
                    <Route path="/dashboard" element={<Navigate to="/admin/users" replace />} />
                    <Route path="/admin/users" element={<PrivateRoute adminOnly><UserManagement /></PrivateRoute>} />
                    <Route path="/admin/finance" element={<PrivateRoute adminOnly><FinanceDashboard /></PrivateRoute>} />
                    <Route path="/admin/reports" element={<PrivateRoute adminOnly><AdminReports /></PrivateRoute>} />
                    <Route path="/admin/notices" element={<PrivateRoute adminOnly><AdminNoticeManagement /></PrivateRoute>} />
                    <Route path="/admin/broadcast" element={<PrivateRoute adminOnly><AdminBroadcast /></PrivateRoute>} />

                    {/* Patient */}
                    <Route path="/patient/dashboard" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />

                    {/* Doctor */}
                    <Route path="/doctor/dashboard" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />

                    {/* Pharmacy */}
                    <Route path="/pharmacy/dashboard" element={<PrivateRoute><PharmacyDashboard /></PrivateRoute>} />

                    {/* Supplier */}
                    <Route path="/supplier/dashboard" element={<PrivateRoute><SupplierDashboard /></PrivateRoute>} />

                    {/* Laboratory */}
                    <Route path="/lab/dashboard" element={<PrivateRoute><LabDashboard /></PrivateRoute>} />

                    {/* Legal & Support */}
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/security" element={<Security />} />

                    {/* Landing Page & Fallbacks */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Chatbot />
            </BrowserRouter>
        </AuthProvider>
    );
}
